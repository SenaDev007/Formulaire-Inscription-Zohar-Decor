"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Loader2,
  Users,
  Wallet,
  TrendingUp,
  Percent,
  Download,
  FileText,
  Search,
  Edit3,
  Check,
  X,
  MessageCircle,
  Mail,
  ExternalLink,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Stats = {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
  remaining: number;
  capacity: number;
  fillRate: number;
  totalAmount: number;
  inscriptionAmount: number;
  completAmount: number;
};

type ParticipantRow = {
  id: string;
  registrationId: string;
  nomComplet: string;
  prenoms: string;
  sexe: string;
  dateNaissance: string;
  telWhatsApp: string;
  telSecondaire?: string | null;
  email: string;
  ville: string;
  profession: string;
  niveauEtudes: string;
  sourceConnaissance: string;
  status: string;
  paymentType?: string | null;
  createdAt: string;
  payments?: { id: string; amount: number; status: string; type: string; provider: string }[];
};

type Admin = { id: string; email: string; name: string; role: string };

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "En attente", color: "#92400E", bg: "#FEF3C7" },
  PAID_INSCRIPTION: { label: "Inscrit payé", color: "#065F46", bg: "#D1FAE5" },
  PAID_FULL: { label: "Complet payé", color: "#065F46", bg: "#D1FAE5" },
  VALIDATED: { label: "Validé", color: "#1E3A8A", bg: "#DBEAFE" },
  CANCELLED: { label: "Annulé", color: "#991B1B", bg: "#FEE2E2" },
};

export function AdminSection() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) setAdmin(json.admin);
        }
      } catch {
        /* ignore */
      }
      setAuthChecked(true);
    })();
  }, []);

  const handleLogin = (a: Admin) => setAdmin(a);
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdmin(null);
  };

  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-beige/30">
        <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard admin={admin} onLogout={handleLogout} />;
}

function LoginScreen({ onLogin }: { onLogin: (a: Admin) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast({
          title: "Connexion refusée",
          description: json.error || "Identifiants invalides.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Bienvenue", description: json.admin.name });
      onLogin(json.admin);
    } catch {
      toast({
        title: "Erreur réseau",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-noir px-4 py-12">
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, #C9A227 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-blanc rounded-3xl premium-shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-noir flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-[#C9A227]" />
          </div>
          <h1
            className="text-2xl font-bold text-noir"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Espace Administrateur
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zohar Décor — Formation Résine Époxy
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-noir font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zohardecor.com"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-noir font-medium">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-3 rounded-lg bg-beige/50 text-xs text-muted-foreground text-center leading-relaxed">
          Compte par défaut :{" "}
          <code className="text-noir">admin@zohardecor.com</code> /{" "}
          <code className="text-noir">ZoharDecor2026!</code>
          <br />
          (créé automatiquement via <code>/api/seed</code>)
        </div>
      </motion.div>
    </section>
  );
}

function Dashboard({ admin, onLogout }: { admin: Admin; onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ParticipantRow | null>(null);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [bulkWaOpen, setBulkWaOpen] = useState(false);
  const { toast } = useToast();

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setStats(json.stats);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const loadParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/participants?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setParticipants(json.participants);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadStats();
    loadParticipants();
  }, [loadStats, loadParticipants]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => loadParticipants(), 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const validatePayment = async (paymentId: string) => {
    setValidatingId(paymentId);
    try {
      const res = await fetch("/api/admin/validate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "Paiement validé",
          description: "Email de confirmation envoyé au participant.",
        });
        await Promise.all([loadStats(), loadParticipants()]);
      } else {
        toast({ title: "Erreur", description: json.error, variant: "destructive" });
      }
    } finally {
      setValidatingId(null);
    }
  };

  const exportData = (format: "xlsx" | "pdf") => {
    window.open(`/api/admin/export?format=${format}`, "_blank");
  };

  const money = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-beige/30">
      {/* Top bar */}
      <div className="bg-noir text-blanc">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blanc border border-[#C9A227]/30">
              <img
                src="/logo_zohar_decor.png"
                alt="Zohar Décor"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wider">ZOHAR DÉCOR — Admin</p>
              <p className="text-xs text-blanc/60">{admin.name} · {admin.email}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-blanc/20 text-blanc hover:bg-blanc/10 hover:text-blanc rounded-full"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total inscrits"
            value={stats ? String(stats.total) : "—"}
            sub={`sur ${stats?.capacity ?? 10} places`}
            color="#C9A227"
          />
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Montant encaissé"
            value={stats ? `${money(stats.totalAmount)} FCFA` : "—"}
            sub={`Inscriptions: ${money(stats?.inscriptionAmount ?? 0)}`}
            color="#111111"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Places restantes"
            value={stats ? String(stats.remaining) : "—"}
            sub={`${stats?.pending ?? 0} en attente de paiement`}
            color="#92400E"
          />
          <StatCard
            icon={<Percent className="w-5 h-5" />}
            label="Taux de remplissage"
            value={stats ? `${stats.fillRate}%` : "—"}
            sub={`${stats?.paid ?? 0} payants`}
            color="#065F46"
          />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={() => exportData("xlsx")}
            variant="outline"
            className="rounded-full bg-blanc border-beige"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Excel
          </Button>
          <Button
            onClick={() => exportData("pdf")}
            variant="outline"
            className="rounded-full bg-blanc border-beige"
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Export PDF
          </Button>
          <Button
            onClick={() => setBulkEmailOpen(true)}
            variant="outline"
            className="rounded-full bg-blanc border-beige"
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Email collectif
          </Button>
          <Button
            onClick={() => setBulkWaOpen(true)}
            className="rounded-full bg-[#25D366] text-white hover:bg-[#1DA851]"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            WhatsApp collectif
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-4 bg-blanc border-beige">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, email, téléphone, n° inscription..."
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="sm:w-56">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="PAID_INSCRIPTION">Inscription payée</SelectItem>
                <SelectItem value="PAID_FULL">Formation complète payée</SelectItem>
                <SelectItem value="VALIDATED">Validé</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-blanc border-beige overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-noir text-blanc">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">N°</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Participant</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Ville</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider">Statut</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Loader2 className="w-6 h-6 text-[#C9A227] animate-spin mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">Chargement...</p>
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      Aucun inscrit pour cette recherche.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => {
                    const lastPayment = p.payments?.[0];
                    const st = STATUS_LABELS[p.status] || STATUS_LABELS.PENDING;
                    return (
                      <tr
                        key={p.id}
                        className="border-t border-beige hover:bg-beige/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p
                            className="font-mono text-xs font-semibold text-noir"
                            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                          >
                            {p.registrationId}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-noir text-sm">
                            {p.nomComplet} {p.prenoms}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.profession}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-xs text-noir">{p.telWhatsApp}</p>
                          <p className="text-xs text-muted-foreground break-all">
                            {p.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                          {p.ville}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="font-medium text-xs"
                            style={{
                              color: st.color,
                              backgroundColor: st.bg,
                              borderColor: st.color + "40",
                            }}
                          >
                            {st.label}
                          </Badge>
                          {lastPayment && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Intl.NumberFormat("fr-FR").format(lastPayment.amount)} FCFA
                              {lastPayment.status === "PENDING" && " · en attente"}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {lastPayment &&
                              lastPayment.status !== "SUCCESS" && (
                                <Button
                                  size="sm"
                                  onClick={() => validatePayment(lastPayment.id)}
                                  disabled={validatingId === lastPayment.id}
                                  className="h-8 px-3 bg-[#C9A227] text-noir hover:bg-[#D4AF37] rounded-full text-xs"
                                >
                                  {validatingId === lastPayment.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <>
                                      <Check className="w-3 h-3 mr-1" />
                                      Valider
                                    </>
                                  )}
                                </Button>
                              )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditing(p)}
                              className="h-8 px-3 rounded-full text-xs border-beige"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Détails
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {participants.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground text-center">
            {participants.length} inscrit(s) affiché(s) · {stats?.total ?? 0} au total
          </p>
        )}
      </div>

      {/* Edit dialog */}
      <EditDialog
        participant={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          loadParticipants();
          loadStats();
        }}
      />

      {/* Bulk email */}
      <BulkEmailSheet open={bulkEmailOpen} onOpenChange={setBulkEmailOpen} />

      {/* Bulk WhatsApp */}
      <BulkWhatsAppSheet open={bulkWaOpen} onOpenChange={setBulkWaOpen} />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <Card className="p-5 bg-blanc border-beige premium-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold text-noir mt-1">{value}</p>
          <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "15", color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function EditDialog({
  participant,
  onClose,
  onSaved,
}: {
  participant: ParticipantRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<ParticipantRow>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (participant) setForm(participant);
  }, [participant]);

  if (!participant) return null;

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/participants/${participant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        toast({ title: "Dossier modifié" });
        onSaved();
      } else {
        toast({
          title: "Erreur",
          description: JSON.stringify(json.errors),
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof ParticipantRow; label: string; type?: string }[] = [
    { key: "nomComplet", label: "Nom complet" },
    { key: "prenoms", label: "Prénom(s)" },
    { key: "sexe", label: "Sexe" },
    { key: "dateNaissance", label: "Date de naissance", type: "date" },
    { key: "telWhatsApp", label: "Téléphone WhatsApp" },
    { key: "telSecondaire", label: "Téléphone secondaire" },
    { key: "email", label: "Email", type: "email" },
    { key: "ville", label: "Ville" },
    { key: "profession", label: "Profession" },
    { key: "niveauEtudes", label: "Niveau d'études" },
    { key: "sourceConnaissance", label: "Source" },
  ];

  return (
    <Dialog open={!!participant} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-[#C9A227] font-mono text-sm">
              {participant.registrationId}
            </span>
            <span className="text-noir">{participant.nomComplet}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3 py-2">
          {fields.map((f) => (
            <div key={f.key}>
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              <Input
                type={f.type || "text"}
                value={(form[f.key] as string) || ""}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                className="mt-1"
              />
            </div>
          ))}
          <div>
            <Label className="text-xs text-muted-foreground">Statut</Label>
            <Select
              value={form.status || ""}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="PAID_INSCRIPTION">Inscription payée</SelectItem>
                <SelectItem value="PAID_FULL">Formation complète payée</SelectItem>
                <SelectItem value="VALIDATED">Validé</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {participant.payments && participant.payments.length > 0 && (
          <div className="bg-beige/50 rounded-lg p-3 mt-2">
            <p className="text-xs font-semibold text-noir mb-2">Historique de paiements</p>
            {participant.payments.map((pay) => (
              <div key={pay.id} className="flex justify-between text-xs py-1">
                <span>
                  {new Intl.NumberFormat("fr-FR").format(pay.amount)} FCFA — {pay.provider}
                </span>
                <span className="text-muted-foreground">{pay.status}</span>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4 mr-1" />
            Annuler
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-1" />
            )}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BulkEmailSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "validated">("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const { toast } = useToast();

  const send = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Sujet et message requis", variant: "destructive" });
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, filter }),
      });
      const json = await res.json();
      if (json.success) {
        setResult({ sent: json.sent, failed: json.failed, total: json.total });
        toast({
          title: `${json.sent} email(s) envoyé(s)`,
          description: json.failed > 0 ? `${json.failed} échec(s)` : undefined,
        });
      } else {
        toast({ title: "Erreur", description: json.error, variant: "destructive" });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Email collectif</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-xs text-muted-foreground">Destinataires</Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les inscrits</SelectItem>
                <SelectItem value="paid">Payants uniquement</SelectItem>
                <SelectItem value="pending">En attente uniquement</SelectItem>
                <SelectItem value="validated">Validés uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Sujet</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex. Rappel : formation du 09 juillet"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour,&#10;&#10;Nous vous contactons..."
              className="mt-1 min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Le message sera envoyé depuis noreply@academiahelm.com
            </p>
          </div>
          {result && (
            <div className="bg-beige/50 rounded-lg p-3 text-sm">
              <p className="font-semibold text-noir">
                {result.sent} / {result.total} envoyés
              </p>
              {result.failed > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  {result.failed} échec(s) — voir logs serveur
                </p>
              )}
            </div>
          )}
        </div>
        <SheetFooter>
          <Button
            onClick={send}
            disabled={sending}
            className="bg-noir text-blanc hover:bg-[#1A1A1A] rounded-full w-full"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-1" />
                Envoyer
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function BulkWhatsAppSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "validated">("all");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<{ name: string; registrationId: string; phone: string; link: string }[]>([]);
  const { toast } = useToast();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bulk-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message || undefined, filter }),
      });
      const json = await res.json();
      if (json.success) {
        setLinks(json.links);
        toast({ title: `${json.total} lien(s) généré(s)` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>WhatsApp collectif</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="bg-[#25D366]/10 rounded-lg p-3 text-xs text-noir leading-relaxed">
            <p className="font-semibold mb-1">Comment ça marche ?</p>
            Cette fonction génère un lien <code>wa.me</code> pour chaque inscrit.
            Cliquez sur chaque lien pour ouvrir WhatsApp avec le message pré-rempli,
            puis envoyez. Aucune API WhatsApp Business n'est nécessaire.
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Destinataires</Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les inscrits</SelectItem>
                <SelectItem value="paid">Payants uniquement</SelectItem>
                <SelectItem value="pending">En attente uniquement</SelectItem>
                <SelectItem value="validated">Validés uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Message (optionnel — défaut : message de confirmation)
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Laissez vide pour utiliser le message par défaut"
              className="mt-1 min-h-[120px]"
            />
          </div>
          <Button
            onClick={generate}
            disabled={loading}
            className="w-full bg-[#25D366] text-white hover:bg-[#1DA851] rounded-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <MessageCircle className="w-4 h-4 mr-1" />
            )}
            Générer les liens
          </Button>

          {links.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <p className="text-xs font-semibold text-noir">
                {links.length} lien(s) — cliquez pour ouvrir WhatsApp
              </p>
              {links.map((l, i) => (
                <a
                  key={l.registrationId}
                  href={l.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-beige/50 hover:bg-beige transition-colors text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-noir truncate">
                      {i + 1}. {l.name}
                    </p>
                    <p className="text-muted-foreground">{l.phone}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
