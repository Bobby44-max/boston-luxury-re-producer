import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center relative z-10">
      <div className="glass-panel p-8 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-luxury-gold via-luxury-gold/80 to-luxury-gold/40 flex items-center justify-center shadow-lg shadow-luxury-gold/20 ring-1 ring-white/10">
            <span className="text-black font-black text-2xl tracking-tighter">A</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight font-syne">
            <span className="bg-gradient-to-r from-white via-luxury-gold to-white/80 bg-clip-text text-transparent">
              APEX BOSTON
            </span>
          </h1>
          <p className="text-luxury-gold/40 text-xs font-bold tracking-[0.2em] uppercase mt-2">Intelligence Studio</p>
        </div>

        <SignUp
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
                "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold/50 transition-all duration-300",
              formFieldLabel: "text-white/60 font-medium",
              formButtonPrimary:
                "bg-gradient-to-r from-luxury-gold to-[#B8962F] hover:opacity-90 font-bold text-black border-0 shadow-lg shadow-luxury-gold/10",
              footerActionLink: "text-luxury-gold hover:text-luxury-gold/80 transition-colors",
              identityPreviewEditButton: "text-luxury-gold",
              formFieldInputShowPasswordButton: "text-white/50",
              separatorLine: "bg-white/10",
              separatorText: "text-white/40 text-[10px] uppercase tracking-widest font-bold",
            },
            variables: {
              colorPrimary: "#D4AF37",
              colorBackground: "transparent",
              colorText: "white",
              colorTextSecondary: "rgba(255,255,255,0.5)",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "white",
              borderRadius: "0.5rem",
            },
          }}
        />
      </div>
    </div>
  );
}
