import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (account: any) => void;
}

export function ClientOnboardingModal({ isOpen, onClose, onCreated }: ClientOnboardingModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cs-portal/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const account = await response.json();
        onCreated(account);
        setName("");
        onClose();
      }
    } catch (error) {
      console.error('Failed to create account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a1628] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Client</DialogTitle>
          <DialogDescription className="text-white/60">
            Create a new client account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Client Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter client name"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: number | null;
  onCreated: (agent: any) => void;
}

export function AgentCreationModal({ isOpen, onClose, accountId, onCreated }: AgentCreationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cs-portal/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, accountId })
      });

      if (response.ok) {
        const agent = await response.json();
        onCreated(agent);
        setName("");
        setEmail("");
        onClose();
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a1628] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Agent</DialogTitle>
          <DialogDescription className="text-white/60">
            Create a new agent for the selected account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="agent-name" className="text-white">Agent Name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter agent name"
              required
            />
          </div>
          <div>
            <Label htmlFor="agent-email" className="text-white">Email</Label>
            <Input
              id="agent-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="agent@example.com"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface TeamCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: number | null;
  onCreated: (team: any) => void;
}

export function TeamCreationModal({ isOpen, onClose, accountId, onCreated }: TeamCreationModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cs-portal/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, accountId })
      });

      if (response.ok) {
        const team = await response.json();
        onCreated(team);
        setName("");
        setDescription("");
        onClose();
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a1628] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Team</DialogTitle>
          <DialogDescription className="text-white/60">
            Create a new team for the selected account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="team-name" className="text-white">Team Name</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter team name"
              required
            />
          </div>
          <div>
            <Label htmlFor="team-description" className="text-white">Description</Label>
            <Input
              id="team-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Team description (optional)"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
