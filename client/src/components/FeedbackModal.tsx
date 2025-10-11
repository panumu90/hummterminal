import { useState } from "react";
import { X, Send, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = 'bug' | 'feature' | 'ui' | 'other';
type Priority = 'low' | 'medium' | 'high';

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState<Category>('other');
  const [priority, setPriority] = useState<Priority>('medium');
  const [email, setEmail] = useState("");
  const [wantsReply, setWantsReply] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setErrorMessage("Palaute ei voi olla tyhjä");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          category,
          priority,
          userContext: window.location.pathname,
          timestamp: new Date().toISOString(),
          email: wantsReply && email.trim() ? email.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Palautteen lähetys epäonnistui");
      }

      setSubmitStatus('success');

      // Reset form after 2 seconds and close
      setTimeout(() => {
        setFeedback("");
        setCategory('other');
        setPriority('medium');
        setEmail("");
        setWantsReply(false);
        setSubmitStatus('idle');
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error("Feedback error:", error);
      setSubmitStatus('error');
      setErrorMessage(error.message || "Palautteen lähetys epäonnistui");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedback("");
      setCategory('other');
      setPriority('medium');
      setEmail("");
      setWantsReply(false);
      setSubmitStatus('idle');
      setErrorMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] bg-slate-900/98 border-2 border-purple-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-400/40">
              <Send className="h-5 w-5 text-purple-300" />
            </div>
            Lähetä palaute Panulle
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Kerro ajatuksesi sovelluksesta. Panu vastaanottaa palautteen suoraan sähköpostiin.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === 'success' ? (
          // Success State
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Palaute lähetetty!</h3>
              <p className="text-slate-400 text-sm">
                Kiitos palautteestasi. Panu käsittelee sen pian.
              </p>
            </div>
          </div>
        ) : (
          // Form State
          <div className="space-y-6 py-4">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Kategoria</Label>
              <RadioGroup value={category} onValueChange={(v) => setCategory(v as Category)}>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    category === 'bug'
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="bug" id="bug" />
                    <span className="text-sm text-slate-200">🐛 Bugi</span>
                  </label>

                  <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    category === 'feature'
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="feature" id="feature" />
                    <span className="text-sm text-slate-200">✨ Ominaisuus</span>
                  </label>

                  <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    category === 'ui'
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="ui" id="ui" />
                    <span className="text-sm text-slate-200">🎨 UI/UX</span>
                  </label>

                  <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    category === 'other'
                      ? 'border-slate-500/50 bg-slate-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="other" id="other" />
                    <span className="text-sm text-slate-200">💬 Muu</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Priority Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Prioriteetti</Label>
              <RadioGroup value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    priority === 'low'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="low" id="low" />
                    <span className="text-sm text-slate-200">Matala</span>
                  </label>

                  <label className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    priority === 'medium'
                      ? 'border-yellow-500/50 bg-yellow-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="medium" id="medium" />
                    <span className="text-sm text-slate-200">Keskitaso</span>
                  </label>

                  <label className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    priority === 'high'
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                  }`}>
                    <RadioGroupItem value="high" id="high" />
                    <span className="text-sm text-slate-200">Korkea</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Feedback Text */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Palautteesi</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Kerro mitä ajattelet sovelluksesta..."
                className="min-h-[120px] bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-slate-500">
                {feedback.length} / 1000 merkkiä
              </p>
            </div>

            {/* Optional Email */}
            <div className="space-y-3 p-4 rounded-lg border border-slate-700/50 bg-slate-800/20">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wantsReply"
                  checked={wantsReply}
                  onCheckedChange={(checked) => setWantsReply(checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="wantsReply" className="text-sm text-slate-300 cursor-pointer">
                  Haluan vastauksen palautteeseen
                </Label>
              </div>

              {wantsReply && (
                <div className="space-y-2 pt-2">
                  <Label className="text-white font-medium text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Sähköpostiosoitteesi
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="esimerkki@yritys.fi"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-slate-500">
                    Panu vastaa sinulle tähän osoitteeseen
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {submitStatus === 'error' && errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 border-slate-600 hover:bg-slate-800 text-slate-300"
              >
                Peruuta
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !feedback.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/30"
              >
                {isSubmitting ? (
                  <>Lähetetään...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Lähetä palaute
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
