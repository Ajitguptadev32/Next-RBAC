import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@heroui/button"


export function KitchenDesignHeros() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-muted-foreground/20 px-4 py-1.5 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Premium Kitchen Design Services
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Transform Your <span className="text-primary">Kitchen</span> Into a Masterpiece
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                Elevate your home with our bespoke kitchen designs that blend functionality with stunning aesthetics.
                From concept to completion, we bring your dream kitchen to life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button  className="px-8 h-12 text-base">
                <Link href="/portfolio">
                  View Our Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button  size="lg" className="px-8 h-12 text-base">
                <Link href="/consultation">Book a Consultation</Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="ml-2 font-medium">5.0 (200+ Reviews)</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block"></div>
              <div className="font-medium">15+ Years of Excellence</div>
            </div>
          </div>

          <div className="relative mx-auto lg:mr-0 mt-8 lg:mt-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-muted/20 blur-xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border bg-background/80 backdrop-blur-sm shadow-lg p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src="/placeholder.svg?height=600&width=480"
                  width={480}
                  height={600}
                  alt="Modern kitchen design with marble countertops and wooden cabinets"
                  className="object-cover h-full w-full"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-white font-medium">Modern Elegance</span>
                </div>
              </div>

              <div className="grid grid-rows-2 gap-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                  <Image
                    src="/placeholder.svg?height=300&width=450"
                    width={450}
                    height={300}
                    alt="Minimalist kitchen with island and pendant lights"
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="text-white font-medium text-sm">Minimalist</span>
                  </div>
                </div>

                <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                  <Image
                    src="/placeholder.svg?height=300&width=450"
                    width={450}
                    height={300}
                    alt="Rustic kitchen design with wooden beams"
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span className="text-white font-medium text-sm">Rustic Charm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold">Custom Design</h3>
            <p className="text-sm text-muted-foreground">Tailored to your unique style and space</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold">Quality Materials</h3>
            <p className="text-sm text-muted-foreground">Premium selections for lasting beauty</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold">Expert Installation</h3>
            <p className="text-sm text-muted-foreground">Professional craftsmanship guaranteed</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <h3 className="text-xl font-bold">Full Service</h3>
            <p className="text-sm text-muted-foreground">From concept to completion</p>
          </div>
        </div>
      </div>
    </section>
  )
}

