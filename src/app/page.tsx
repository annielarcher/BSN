'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Music, ArrowRight, Handshake, Star, ChevronDown, ChevronUp, ExternalLink, CalendarDays } from 'lucide-react';

import { ImageAssets } from '@/lib/placeholder-images';
import { lideranca, testimonials, parceiros } from '@/lib/institutional-data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImage = ImageAssets.find((img) => img.id === 'institutional-hero');
  const logoImage = ImageAssets.find((img) => img.id === 'bsn-logo');
  const [expandedTestimonial, setExpandedTestimonial] = useState<string | null>(null);

  const toggleTestimonial = (id: string) => {
    setExpandedTestimonial(expandedTestimonial === id ? null : id);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] text-white overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/50" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <div className="flex flex-col items-center justify-center gap-2 md:gap-3 w-full -mt-10 md:-mt-20">
            {logoImage && (
              <Image 
                src={logoImage.imageUrl} 
                alt="Banda Sinfônica Nacional Logo" 
                width={900} 
                height={450} 
                className="object-contain animate-fade-in-down w-full max-w-[400px] sm:max-w-[650px] md:max-w-[900px] h-auto max-h-[55vh] md:max-h-[70vh]" 
                priority 
              />
            )}
            <div className="opacity-0 animate-fade-in-up -mt-4 md:-mt-8" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base py-4 sm:py-5 px-6 sm:px-8 rounded-full shadow-lg shadow-primary/20 transform transition-transform hover:scale-105">
                <Link href="/agenda">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Nossa Agenda
                </Link>
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 bg-card">
        <div className="container max-w-5xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Uma Nova Sonoridade Para o Brasil</h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-3xl mx-auto text-justify">
            A Banda Sinfônica Nacional é um organismo vivo, que respira e pulsa ao ritmo da diversidade cultural do nosso país. Composta por músicos de alta qualificação de todo o Brasil e do exterior, nosso propósito é explorar novos horizontes, dar voz a novos compositores e levar a riqueza da música sinfônica a todos os cantos.
          </p>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/sobre">
              Conheça Nossa História <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Liderança Section */}
      <section id="lideranca" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">Nossa Liderança</h2>
            <p className="text-muted-foreground mt-2 text-lg">As mentes e corações que guiam nossa jornada.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {lideranca.map((idealizador) => {
              const image = ImageAssets.find((img) => img.id === idealizador.id);
              return (
                <Card key={idealizador.id} className="bg-card border-border/60 shadow-md flex flex-col text-center items-center transform-gpu will-change-transform">
                  <CardHeader className="pt-8">
                    <Avatar className="h-32 w-32 mx-auto border-4 border-primary">
                      {image && <AvatarImage src={image.imageUrl} alt={idealizador.nome} data-ai-hint={image.imageHint} />}
                      <AvatarFallback>{idealizador.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-3xl pt-4">{idealizador.nome}</CardTitle>
                    <CardDescription className="text-primary font-semibold">{idealizador.cargo}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground mb-6 line-clamp-4 text-justify">
                      {idealizador.bio}
                    </p>
                    <Button asChild variant="ghost" className="mt-auto text-primary hover:text-primary">
                      <Link href="/idealizadores">
                        Ler mais <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parceiros Section */}
      <section id="parceiros" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">Nossos Parceiros</h2>
            <p className="text-muted-foreground mt-2 text-lg">Instituições e profissionais que apoiam a nossa música.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {parceiros.map((parceiro) => {
              const image = ImageAssets.find((img) => img.id === parceiro.imageId);
              const CardContentElement = (
                <Card className={`bg-card border-border/60 shadow-md flex flex-col text-center items-center transform-gpu will-change-transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/50 group h-full relative ${parceiro.website ? 'cursor-pointer' : ''}`}>
                  {parceiro.website && (
                    <div className="absolute top-4 right-4 text-muted-foreground group-hover:text-primary transition-colors opacity-70 group-hover:opacity-100">
                      <ExternalLink className="h-6 w-6" />
                    </div>
                  )}
                  <CardHeader className="pt-8 w-full flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-white border-4 border-muted flex items-center justify-center mb-4 overflow-hidden group-hover:border-primary transition-colors duration-300">
                      {image ? (
                        <Image src={image.imageUrl} alt={parceiro.name} width={128} height={128} className="object-cover" />
                      ) : (
                        <Handshake className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      )}
                    </div>
                    <CardTitle className="font-headline text-2xl md:text-3xl pt-2">{parceiro.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold text-base mt-1">{parceiro.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center pb-8 px-6">
                    <p className="text-muted-foreground text-center line-clamp-4">
                      {parceiro.description}
                    </p>
                  </CardContent>
                </Card>
              );

              return parceiro.website ? (
                <Link key={parceiro.id} href={parceiro.website} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                  {CardContentElement}
                </Link>
              ) : (
                <div key={parceiro.id}>
                  {CardContentElement}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">O Que Dizem Sobre Nós</h2>
            <p className="text-muted-foreground mt-2 text-lg">Depoimentos de quem apoia e admira nosso trabalho.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
            {testimonials.map((testimonial) => {
              const image = ImageAssets.find((img) => img.id === testimonial.avatarId);
              const isLong = testimonial.id === 'depoimento-1';
              const isExpanded = expandedTestimonial === testimonial.id;

              return (
                <Card key={testimonial.id} className="bg-background border-border/60 shadow-md flex flex-col transform-gpu will-change-transform">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-14 w-14 border-2 border-primary">
                      {image && <AvatarImage src={image.imageUrl} alt={testimonial.name} data-ai-hint={image.imageHint} />}
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-bold">{testimonial.name}</CardTitle>
                      <CardDescription className="text-primary font-semibold">{testimonial.title}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <blockquote className={cn(
                        "text-muted-foreground italic border-l-4 border-primary/50 pl-4 text-justify transition-all ease-in-out duration-500",
                        isLong && "overflow-hidden",
                        isLong && !isExpanded && "max-h-36 line-clamp-6",
                        isLong && isExpanded && "max-h-[999px]"
                      )}>
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                  <CardFooter className="pt-4 flex justify-between items-center">
                    <div className="flex gap-1 text-primary">
                      <Star className="fill-primary" />
                      <Star className="fill-primary" />
                      <Star className="fill-primary" />
                      <Star className="fill-primary" />
                      <Star className="fill-primary" />
                    </div>
                    {isLong && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleTestimonial(testimonial.id)}
                        className="text-primary hover:text-primary/90 p-0"
                      >
                        {isExpanded ? 'Ler menos' : 'Ler mais'}
                        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" /> }
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sponsor CTA Section */}
      <section id="patrocinio" className="py-20 md:py-32 bg-background">
        <div className="container text-center">
          <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            Seja um Patrocinador
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
            Apoie a cultura e associe sua marca à excelência da música sinfônica. Junte-se a nós na missão de transformar vidas através da arte.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-lg py-6 px-6 sm:px-12 rounded-full shadow-lg shadow-primary/30 transform transition-transform hover:scale-105">
            <Link href="mailto:bandasinfonicanacional@gmail.com">
              Entre em Contato
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
