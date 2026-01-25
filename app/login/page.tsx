import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center relative z-10">
      <div className="glass-panel p-12 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Apex Real Estate</span>
          </h1>
          <p className="text-white/40">AI Production Suite</p>
        </div>

        {/* Clerk Sign In */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white text-black hover:bg-white/90 border-0",
              socialButtonsBlockButtonText: "font-semibold",
              formFieldInput:
                "bg-white/5 border-white/10 text-white placeholder:text-white/30",
              formButtonPrimary:
                "bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90",
              footerActionLink: "text-cyan-400 hover:text-cyan-300",
              identityPreviewEditButton: "text-cyan-400",
            },
            variables: {
              colorPrimary: "#0dccf2",
              colorBackground: "transparent",
              colorText: "white",
              colorTextSecondary: "rgba(255,255,255,0.5)",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "white",
            },
          }}
          redirectUrl="/tools"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
