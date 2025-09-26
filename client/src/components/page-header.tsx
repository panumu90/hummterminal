import { Building, ChartLine, Clock, Globe } from "lucide-react";

export function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Onnistuneet AI-Asiakaspalvelutoteutukset
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        Kuusi todistettua case-esimerkkiä tekoälyn hyödyntämisestä asiakaspalvelussa. 
        Tutustu toteutuksiin ja kysy tarkempia kysymyksiä chat-ikkunasta.
      </p>
      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <ChartLine className="h-4 w-4 text-primary" />
          <span>6 Onnistunutta toteutusta</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Päivitetty 2025</span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-primary" />
          <span>Kansainväliset & kotimaiset caset</span>
        </div>
      </div>
    </div>
  );
}
