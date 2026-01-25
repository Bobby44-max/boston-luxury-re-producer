import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center relative z-10">
      <div className="glass-panel p-8 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Real Easy Realty
            </span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Sign in to continue</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-transparent shadow-none p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white text-black hover:bg-white/90 border-0 font-semibold",
              socialButtonsBlockButtonText: "font-semibold",
              dividerLine: "bg-white/10",
              dividerText: "text-white/40",
              formFieldInput:
                "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500",
              formFieldLabel: "text-white/60",
              formButtonPrimary:
                "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 font-semibold",
              footerActionLink: "text-emerald-400 hover:text-emerald-300",
              identityPreviewEditButton: "text-emerald-400",
              formFieldInputShowPasswordButton: "text-white/50",
              otpCodeFieldInput: "bg-white/5 border-white/10 text-white",
            },
            variables: {
              colorPrimary: "#10b981",
              colorBackground: "transparent",
              colorText: "white",
              colorTextSecondary: "rgba(255,255,255,0.5)",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "white",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>
    </div>
  );
}
