import Image from "next/image";
import MaxWrapper from "../shared/wrapper";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function ContactSection() {
  return (
    <div className="flex-1 h-max relative group overflow-hidden">
      <Image
        src="/img/banner.avif"
        alt="/"
        width={1234}
        height={700}
        priority
        quality={100}
        className="w-full h-full object-cover group-hover:scale-150 transition-all duration-1000 brightness-50 absolute top-0 left-0"
      />

      <MaxWrapper className="py-16 relative flex justify-end">
        <div className="w-full max-w-lg h-full bg-secondary p-5 md:p-8 pb-7 md:pb-9 rounded-lg">
          <h1 className="text-2xl md:text-3xl font-bold">Get In Touch</h1>
          <p className="text-sm md:text-base font-medium mb-4 md:mb-6">
            We will get back to you within 24 hours.
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <Input
              placeholder="Full Name"
              className="h-12 border-muted-foreground/30"
            />
            <Input
              placeholder="Email"
              className="h-12 border-muted-foreground/30"
            />
            <Input
              placeholder="Phone Number"
              className="h-12 border-muted-foreground/30"
            />
            <Textarea
              placeholder="Message"
              className="h-11 border-muted-foreground/30"
            />

            <Button className="h-14">Send Message</Button>
          </div>
        </div>
      </MaxWrapper>
    </div>
  );
}
