import { useState, useEffect } from "react";
import { Sparkles, UserPlus, Building2, Users, Send, Loader2 } from "lucide-react";
import type { AICommandResponse } from "../../../shared/types";

interface AICommandInputProps {
  accountId: number | null;
  onAgentCreated: () => void;
  onClientCreated: () => void;
  onTeamCreated: () => void;
  onShowAgentModal: () => void;
  onShowClientModal: () => void;
  onShowTeamModal: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function AICommandInput({
  accountId,
  onAgentCreated,
  onClientCreated,
  onTeamCreated,
  onShowAgentModal,
  onShowClientModal,
  onShowTeamModal,
  showToast,
}: AICommandInputProps) {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const exampleCommands = [
    "Assign John to Support Team",
    "Change Sarah's role to supervisor",
    "Create new team called Sales",
    "Add agent Maria to Technical Support",
    "Update Mike's role to manager",
    "Create team called Customer Success",
    "Assign Emma to Marketing team",
    "Change David's status to active",
  ];

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentExample = exampleCommands[placeholderIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentExample.length) {
        setPlaceholderText(currentExample.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % exampleCommands.length);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [placeholderIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/cs-portal/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, accountId }),
      });

      if (!response.ok) throw new Error('Failed to process command');

      const result: AICommandResponse = await response.json();

      if (result.success) {
        showToast(result.message || 'Command executed successfully', 'success');
        setCommand("");

        // Trigger refetch based on command type
        if (result.type === 'agent') onAgentCreated();
        if (result.type === 'team') onTeamCreated();
        if (result.type === 'client') onClientCreated();
      } else {
        showToast(result.message || 'Failed to process command', 'error');
      }
    } catch (error) {
      showToast('Failed to process AI command', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add Agent",
      color: "from-emerald-500 to-blue-500",
      hoverColor: "hover:shadow-emerald-500/20",
      onClick: onShowAgentModal,
    },
    {
      icon: Building2,
      label: "Onboard Client",
      color: "from-blue-500 to-purple-500",
      hoverColor: "hover:shadow-blue-500/20",
      onClick: onShowClientModal,
    },
    {
      icon: Users,
      label: "Add Team",
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:shadow-purple-500/20",
      onClick: onShowTeamModal,
    },
  ];

  return (
    <div className="p-4 border-t border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-blue-950/30 backdrop-blur-sm">
      {/* Quick Actions */}
      <div className="mb-4">
        <p className="text-xs text-white/60 mb-2 font-medium">Quick Actions</p>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`
                relative group px-3 py-2.5 rounded-lg
                bg-gradient-to-r ${action.color}
                text-white text-xs font-medium
                transition-all duration-200
                hover:scale-105 hover:shadow-lg ${action.hoverColor}
                flex items-center justify-center gap-2
                border border-white/10
              `}
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Command Input */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <p className="text-xs text-white/60 font-medium">AI Assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder={placeholderText}
              disabled={isProcessing}
              rows={2}
              className="
                w-full px-4 py-3 pr-12
                bg-slate-800/50 border border-slate-600/50 rounded-lg
                text-white text-base placeholder:text-purple-400/50 placeholder:italic
                focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all resize-none
                font-medium
              "
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!command.trim() || isProcessing}
              className="
                absolute right-2 bottom-2
                p-2.5 rounded-lg
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:opacity-90 hover:scale-105 transition-all
                flex items-center justify-center
                shadow-lg shadow-purple-500/20
              "
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {/* Example Commands */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-medium">Try these commands:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Assign Maria to Support Team",
              "Change John's role to supervisor",
              "Create team called Technical",
              "Add agent Sarah",
              "Update Mike to manager role",
              "Assign Emma to Marketing",
            ].map((example, idx) => (
              <button
                key={example}
                onClick={() => setCommand(example)}
                className="
                  text-xs px-3 py-2 rounded-lg text-left
                  bg-gradient-to-r from-slate-700/40 to-slate-600/40
                  text-white/70 border border-slate-600/30
                  hover:from-purple-600/30 hover:to-pink-600/30
                  hover:text-white hover:border-purple-500/50
                  transition-all duration-200
                  hover:scale-[1.02] hover:shadow-lg
                  font-medium
                "
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
