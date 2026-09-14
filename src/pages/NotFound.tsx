import { motion } from "framer-motion";
import { Link } from "react-router";
import { NovaButton } from "@/components/store/primitives";

export default function NotFound() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-nova-aurora relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="grain absolute inset-0" />
      <p className="font-label relative text-muted-foreground">Error 404</p>
      <h1 className="relative mt-6 text-[26vw] leading-none font-bold tracking-tighter sm:text-[10rem]">
        <span className="text-nova-gradient">404</span>
      </h1>
      <p className="relative mt-4 max-w-md text-sm leading-6 text-muted-foreground">
        This page drifted out of orbit. The collection, however, is exactly
        where we left it.
      </p>
      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <NovaButton asChild>
          <Link to="/">Back to home</Link>
        </NovaButton>
        <NovaButton asChild variant="secondary">
          <Link to="/shop">Browse the shop</Link>
        </NovaButton>
      </div>
    </motion.main>
  );
}
