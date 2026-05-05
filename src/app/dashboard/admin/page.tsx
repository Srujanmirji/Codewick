"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Users, Coins, AlertTriangle, Snowflake, DoorClosed, Construction, Power } from "lucide-react";
import { toast } from "@/store/useToastStore";

interface PanicSwitches {
  freezeEconomy: boolean;
  disableSignups: boolean;
  maintenanceMode: boolean;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [switches, setSwitches] = useState<PanicSwitches>({
    freezeEconomy: false,
    disableSignups: false,
    maintenanceMode: false,
  });
  const [switchLoading, setSwitchLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
    fetchSettings();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      toast.error(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) return;
      const json = await res.json();
      if (!json.error) {
        setSwitches({
          freezeEconomy: json.freezeEconomy ?? false,
          disableSignups: json.disableSignups ?? false,
          maintenanceMode: json.maintenanceMode ?? false,
        });
      }
    } catch (e) {
      console.error("Failed to fetch settings", e);
    }
  };

  const toggleSwitch = async (key: keyof PanicSwitches) => {
    setSwitchLoading(key);
    const newVal = !switches[key];
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newVal }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSwitches(prev => ({ ...prev, [key]: newVal }));
      const labels: Record<string, string> = {
        freezeEconomy: "Freeze Economy",
        disableSignups: "Lock the Gates",
        maintenanceMode: "Maintenance Mode",
      };
      toast.success(`${labels[key]} ${newVal ? "ACTIVATED" : "DEACTIVATED"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle switch");
    } finally {
      setSwitchLoading(null);
    }
  };

  const handleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: currentBanStatus ? "unban" : "ban" })
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast.success(currentBanStatus ? "User unbanned" : "User banned");
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMint = async (userId: string) => {
    const amount = prompt("How many Time Credits to mint for this user?");
    if (!amount || isNaN(parseFloat(amount))) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast.success(`Minted ${amount} TC successfully`);
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleForceResolve = async (disputeId: string) => {
    const reason = prompt("Enter resolution override reason:");
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionDetails: reason })
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast.success("Dispute forcefully resolved");
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-white animate-pulse">Loading God Mode...</div>;
  }

  if (!data) return null;

  const anyActive = switches.freezeEconomy || switches.disableSignups || switches.maintenanceMode;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 liquid-glass-static p-8 rounded-[32px] border-red-500/30">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white drop-shadow-md">God Mode</h1>
          <p className="text-red-400 font-bold mt-1">System Administrator Panel</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass-static p-6 rounded-[24px] flex items-center gap-4">
          <div className="p-4 bg-cyan-500/20 text-cyan-400 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-white/50 font-bold uppercase text-xs">Total Users</p>
            <p className="text-3xl font-black text-white">{data.metrics.totalUsers}</p>
          </div>
        </div>
        <div className="liquid-glass-static p-6 rounded-[24px] flex items-center gap-4">
          <div className="p-4 bg-amber-500/20 text-amber-400 rounded-2xl"><Coins size={24} /></div>
          <div>
            <p className="text-white/50 font-bold uppercase text-xs">TC In Circulation</p>
            <p className="text-3xl font-black text-white">{data.metrics.totalTimeCredits.toFixed(1)}</p>
          </div>
        </div>
        <div className="liquid-glass-static p-6 rounded-[24px] flex items-center gap-4">
          <div className="p-4 bg-red-500/20 text-red-400 rounded-2xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-white/50 font-bold uppercase text-xs">Active Disputes</p>
            <p className="text-3xl font-black text-white">{data.metrics.activeDisputes}</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PANIC SWITCHES SECTION                                        */}
      {/* ============================================================ */}
      <div
        className="liquid-glass-static p-8 rounded-[32px] flex flex-col gap-6 border transition-all duration-500"
        style={{
          borderColor: anyActive ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)',
          boxShadow: anyActive ? '0 0 40px rgba(239,68,68,0.15)' : 'none',
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Power className={anyActive ? 'text-red-400 animate-pulse' : 'text-white/40'} style={{ transition: 'color 0.3s' }} />
            Master Control Switches
          </h2>
          {anyActive && (
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-400 px-4 py-2 rounded-full animate-pulse"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="w-2 h-2 bg-red-500 rounded-full" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.8)' }} />
              Systems Override Active
            </span>
          )}
        </div>

        {/* Hazard stripe */}
        <div className="w-full h-1 rounded-full" style={{
          background: 'repeating-linear-gradient(90deg, rgba(239,68,68,0.6) 0px, rgba(239,68,68,0.6) 12px, transparent 12px, transparent 24px)'
        }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Freeze Economy Switch */}
          <button
            onClick={() => toggleSwitch("freezeEconomy")}
            disabled={switchLoading === "freezeEconomy"}
            className="relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 cursor-pointer"
            style={{
              background: switches.freezeEconomy ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.03)',
              border: switches.freezeEconomy ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: switches.freezeEconomy ? '0 0 30px rgba(6,182,212,0.4)' : 'none',
              opacity: switchLoading === "freezeEconomy" ? 0.6 : 1,
            }}
          >
            {switches.freezeEconomy && (
              <div className="absolute inset-0 pointer-events-none" style={{
                opacity: 0.2,
                background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.4), transparent 70%)'
              }} />
            )}
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{
                  background: switches.freezeEconomy ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                  color: switches.freezeEconomy ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                }}>
                  <Snowflake size={22} />
                </div>
                <div className="w-14 h-7 rounded-full p-1 flex items-center transition-all duration-300" style={{
                  background: switches.freezeEconomy ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.1)',
                  justifyContent: switches.freezeEconomy ? 'flex-end' : 'flex-start',
                }}>
                  <div className="w-5 h-5 rounded-full transition-all duration-300" style={{
                    background: switches.freezeEconomy ? '#22d3ee' : 'rgba(255,255,255,0.3)',
                    boxShadow: switches.freezeEconomy ? '0 0 10px rgba(6,182,212,0.6)' : 'none',
                  }} />
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: switches.freezeEconomy ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  Freeze Economy
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>Block all Time Credit transfers instantly</p>
              </div>
              {switches.freezeEconomy && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(6,182,212,0.8)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#22d3ee' }} />
                  ACTIVE
                </div>
              )}
            </div>
          </button>

          {/* Lock the Gates Switch */}
          <button
            onClick={() => toggleSwitch("disableSignups")}
            disabled={switchLoading === "disableSignups"}
            className="relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 cursor-pointer"
            style={{
              background: switches.disableSignups ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)',
              border: switches.disableSignups ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: switches.disableSignups ? '0 0 30px rgba(245,158,11,0.4)' : 'none',
              opacity: switchLoading === "disableSignups" ? 0.6 : 1,
            }}
          >
            {switches.disableSignups && (
              <div className="absolute inset-0 pointer-events-none" style={{
                opacity: 0.2,
                background: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.4), transparent 70%)'
              }} />
            )}
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{
                  background: switches.disableSignups ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                  color: switches.disableSignups ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                }}>
                  <DoorClosed size={22} />
                </div>
                <div className="w-14 h-7 rounded-full p-1 flex items-center transition-all duration-300" style={{
                  background: switches.disableSignups ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)',
                  justifyContent: switches.disableSignups ? 'flex-end' : 'flex-start',
                }}>
                  <div className="w-5 h-5 rounded-full transition-all duration-300" style={{
                    background: switches.disableSignups ? '#fbbf24' : 'rgba(255,255,255,0.3)',
                    boxShadow: switches.disableSignups ? '0 0 10px rgba(245,158,11,0.6)' : 'none',
                  }} />
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: switches.disableSignups ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  Lock the Gates
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>Disable all new account registrations</p>
              </div>
              {switches.disableSignups && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.8)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#fbbf24' }} />
                  ACTIVE
                </div>
              )}
            </div>
          </button>

          {/* Maintenance Mode Switch */}
          <button
            onClick={() => toggleSwitch("maintenanceMode")}
            disabled={switchLoading === "maintenanceMode"}
            className="relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 cursor-pointer"
            style={{
              background: switches.maintenanceMode ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
              border: switches.maintenanceMode ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: switches.maintenanceMode ? '0 0 30px rgba(239,68,68,0.4)' : 'none',
              opacity: switchLoading === "maintenanceMode" ? 0.6 : 1,
            }}
          >
            {switches.maintenanceMode && (
              <div className="absolute inset-0 pointer-events-none" style={{
                opacity: 0.2,
                background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.4), transparent 70%)'
              }} />
            )}
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{
                  background: switches.maintenanceMode ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                  color: switches.maintenanceMode ? '#f87171' : 'rgba(255,255,255,0.4)',
                }}>
                  <Construction size={22} />
                </div>
                <div className="w-14 h-7 rounded-full p-1 flex items-center transition-all duration-300" style={{
                  background: switches.maintenanceMode ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)',
                  justifyContent: switches.maintenanceMode ? 'flex-end' : 'flex-start',
                }}>
                  <div className="w-5 h-5 rounded-full transition-all duration-300" style={{
                    background: switches.maintenanceMode ? '#f87171' : 'rgba(255,255,255,0.3)',
                    boxShadow: switches.maintenanceMode ? '0 0 10px rgba(239,68,68,0.6)' : 'none',
                  }} />
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: switches.maintenanceMode ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  Maintenance Mode
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>Lock out all non-admin users from the platform</p>
              </div>
              {switches.maintenanceMode && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(239,68,68,0.8)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#f87171' }} />
                  ACTIVE
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Hazard stripe */}
        <div className="w-full h-1 rounded-full" style={{
          background: 'repeating-linear-gradient(90deg, rgba(239,68,68,0.6) 0px, rgba(239,68,68,0.6) 12px, transparent 12px, transparent 24px)'
        }} />
      </div>

      {/* User Management & Disputes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="liquid-glass-static p-8 rounded-[32px] flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-cyan-400" /> User Management
          </h2>
          <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2 flex flex-col gap-4">
            {data.users.map((u: any) => (
              <div key={u._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold flex items-center gap-2">
                    {u.name} {u.isAdmin && <ShieldAlert size={14} className="text-red-400" />}
                  </p>
                  <p className="text-white/50 text-xs">{u.email}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-bold">
                    <span className="text-amber-400">{u.timeCredits} TC</span>
                    <span className="text-white/30">•</span>
                    <span className={u.isBanned ? "text-red-400" : "text-green-400"}>
                      {u.isBanned ? "Banned" : "Active"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleMint(u._id)}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Mint TC
                  </button>
                  <button 
                    onClick={() => handleBan(u._id, u.isBanned)}
                    className={`${u.isBanned ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} text-xs font-bold px-3 py-1.5 rounded-lg transition-all`}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Overrides */}
        <div className="liquid-glass-static p-8 rounded-[32px] flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-400" /> Active Disputes
          </h2>
          <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2 flex flex-col gap-4">
            {data.disputes.length === 0 ? (
              <p className="text-white/50">No active disputes.</p>
            ) : data.disputes.map((d: any) => (
              <div key={d._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded">Awaiting Response</span>
                  <span className="text-white/40 text-[10px]">{new Date(d.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <p className="text-white text-sm"><span className="text-cyan-400">{d.filedBy.name}</span> reported <span className="text-red-400">{d.filedAgainst.name}</span></p>
                  <p className="text-white/60 text-xs mt-2 italic">&quot;{d.reason}&quot;</p>
                </div>
                <button 
                  onClick={() => handleForceResolve(d._id)}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all self-end"
                >
                  Force Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
