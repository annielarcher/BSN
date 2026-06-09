import { Calendar, MapPin, Clock, ArrowRight, Ticket, Music } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { parsePtBrDate } from '@/lib/utils';
import { ImageAssets } from '@/lib/placeholder-images';
import eventosData from '@/lib/eventos.json';

export const metadata: Metadata = {
  title: 'Agenda',
  description: 'Consulte a agenda de concertos da Banda Sinfônica Nacional. Veja nossas próximas apresentações e relembre os eventos passados.',
};

export default function AgendaPage() {
  // Data atual (meia-noite) para comparação justa
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Filtra os eventos futuros (data maior ou igual a hoje) e ordena do mais próximo pro mais distante
  const upcomingEvents = eventosData.events
    .filter(event => parsePtBrDate(event.date).getTime() >= hoje.getTime())
    .sort((a, b) => parsePtBrDate(a.date).getTime() - parsePtBrDate(b.date).getTime());

  // Filtra os eventos passados (data menor que hoje) e ordena do mais recente pro mais antigo
  const pastEvents = eventosData.events
    .filter(event => parsePtBrDate(event.date).getTime() < hoje.getTime())
    .sort((a, b) => parsePtBrDate(b.date).getTime() - parsePtBrDate(a.date).getTime());

  const nextEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1);
  const nextEventImage = nextEvent ? ImageAssets.find(img => img.id === nextEvent.imageId) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container py-12 md:py-16 flex-grow">
        
        {/* Featured Upcoming Event */}
        <section id="proximos-eventos" className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 bg-primary rounded-full"></div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Próximo Concerto</h2>
          </div>

          {nextEvent ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border group transform-gpu transition-all hover:shadow-primary/20">
              <div className="flex flex-col lg:flex-row">
                {/* Image Area */}
                <div className="w-full lg:w-5/12 relative min-h-[300px] lg:min-h-full overflow-hidden">
                  {nextEventImage ? (
                    <Image 
                      src={nextEventImage.imageUrl} 
                      alt={nextEvent.title} 
                      fill 
                      className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                        (nextEvent as any).imagePosition || 'object-center'
                      }`}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                      <Music className="h-24 w-24 text-white opacity-20" />
                    </div>
                  )}
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border text-center">
                    <div className="text-primary font-black text-2xl leading-none">07</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">JUL</div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="w-full lg:w-7/12 px-8 py-6 md:px-12 md:py-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 w-max">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Confirmado
                  </div>
                  
                  <h3 className="font-headline text-3xl md:text-4xl font-bold mb-3 leading-tight">{nextEvent.title}</h3>
                  <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                    {nextEvent.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted p-3 rounded-full text-primary shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground font-semibold uppercase">Data</div>
                        <div className="font-medium">{nextEvent.date}</div>
                      </div>
                    </div>
                    {nextEvent.time && (
                      <div className="flex items-start gap-3">
                        <div className="bg-muted p-3 rounded-full text-primary shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground font-semibold uppercase">Horário</div>
                          <div className="font-medium">{nextEvent.time}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="bg-muted p-3 rounded-full text-primary shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground font-semibold uppercase">Local</div>
                        <div className="font-medium">{nextEvent.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-card/50 rounded-2xl border border-dashed border-border">
              <Calendar className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Nenhum evento agendado</h3>
              <p className="text-muted-foreground max-w-md">
                Estamos preparando nossa nova temporada. Fique de olho aqui e em nossas redes sociais para não perder as novidades!
              </p>
            </div>
          )}
        </section>

        {/* Other Upcoming Events Grid */}
        {otherUpcomingEvents.length > 0 && (
          <section id="eventos-futuros" className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-2 bg-primary/60 rounded-full"></div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Concertos futuros</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherUpcomingEvents.map((event, index) => (
                <Card key={index} className="bg-card border-primary/30 shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 flex flex-col h-full group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date}
                      {event.time && <span className="ml-1 px-2 py-0.5 bg-primary/10 rounded-md">{event.time}</span>}
                    </div>
                    <CardTitle className="font-headline text-xl lg:text-2xl group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-4">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-6 border-t border-border/30 mt-auto">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{event.location}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Past Events Grid */}
        <section id="historico">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-2 bg-muted-foreground/30 rounded-full"></div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Concertos Anteriores</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index} className="bg-card border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date}
                  </div>
                  <CardTitle className="font-headline text-xl lg:text-2xl group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-4">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/30 mt-auto">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{event.location}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
