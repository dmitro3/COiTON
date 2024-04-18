import MaxWrapper from "./wrapper";
import { site } from "@/constants";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="mt-16 bg-card py-10 border-t">
      <MaxWrapper className="flex flex-col">
        <div className="flex items-center flex-col lg:flex-row justify-between">
          <p className="font-medium text-muted-foreground">
            © 2022 {site.title}
          </p>

          <div className="flex items-center gap-4">
            <Link
              className="font-medium text-muted-foreground hover:text-foreground"
              href="/">
              Privacy
            </Link>
            <Link
              className="font-medium text-muted-foreground hover:text-foreground"
              href="/">
              Accessibility
            </Link>
            <Link
              className="font-medium text-muted-foreground hover:text-foreground"
              href="/">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </MaxWrapper>
    </div>
  );
}
