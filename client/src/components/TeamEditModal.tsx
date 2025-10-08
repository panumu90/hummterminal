import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Target } from "lucide-react";

interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: any | null;
  onUpdated: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function TeamEditModal({ isOpen, onClose, team, onUpdated, showToast }: TeamEditModalProps) {
  const [name, setName] = useState(team?.name || "");
  const [description, setDescription] = useState(team?.description || "");
  const [sla, setSla] = useState(team?.sla || 95);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/cs-portal/teams/${team.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, sla }),
      });

      if (!response.ok) throw new Error('Failed to update team');

      showToast(`Team "${name}" updated successfully`, 'success');
      onUpdated();
      onClose();
    } catch (error) {
      showToast('Failed to update team', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-purple-400" />
            Edit Team
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-white/70">Team Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer Support"
              required
              className="bg-slate-800/50 border-slate-600/50 text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-white/70">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Main support team"
              className="bg-slate-800/50 border-slate-600/50 text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-white/70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              SLA Target (%)
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range"
                min="50"
                max="100"
                value={sla}
                onChange={(e) => setSla(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${sla}%, #334155 ${sla}%, #334155 100%)`
                }}
              />
              <div className="w-16 text-center">
                <div className={`text-lg font-bold ${
                  sla >= 95 ? 'text-green-400' :
                  sla >= 90 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {sla}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-sm text-purple-200">
              <strong>Tip:</strong> SLA targets help measure team performance and ensure quality service delivery.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-slate-700/50 border-slate-600/50 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
