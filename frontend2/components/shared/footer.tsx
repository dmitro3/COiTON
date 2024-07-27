import Wrapper from "./wrapper";
import Logo from "./logo";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { logoSans } from "@/lib/fonts";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t">
      <Wrapper className="flex flex-col max-w-screen-lg 2xl:max-w-screen-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10 md:py-16">
          <div className="flex flex-col gap-2 max-w-sm">
            <Logo />
            <p className="text-sm font-normal">{siteConfig.slogan}</p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <p className="text-sm sm:text-base font-medium">Site</p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                Buy Property
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                Sell Property
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                How it works
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-sm sm:text-base font-medium">Company</p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                About Us
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                Reviews
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                FAQs
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                Stories
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-sm sm:text-base font-medium">Contact</p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                coiton-network@gmail.com
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                Contact Us
              </p>
              <p className="text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer">
                Terms of service
              </p>
            </div>
          </div>
        </div>

        <div className="border-t w-full py-6 text-center">
          <p
            className={cn(
              "text-sm text-muted-foreground font-logo",
              logoSans.variable
            )}>
            Copyright &copy; {new Date().getFullYear()} {siteConfig.title} - All
            rights reserved
          </p>
        </div>
      </Wrapper>
    </footer>
  );
}
