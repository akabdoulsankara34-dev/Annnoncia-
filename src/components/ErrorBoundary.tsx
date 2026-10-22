import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur non gérée capturée par ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {}
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#1B4965] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h1 className="font-['Fredoka',sans-serif] text-2xl font-black text-slate-900 mb-2">
              Oups ! Un petit problème est survenu
            </h1>

            <p className="text-sm text-slate-600 font-semibold mb-4">
              Ne vous inquiétez pas, vous pouvez recharger l'application ou réinitialiser les données pour reprendre la lecture.
            </p>

            {this.state.error && (
              <div className="w-full bg-slate-100 rounded-xl p-3 mb-5 text-left text-xs font-mono text-slate-700 overflow-x-auto max-h-32 border border-slate-300">
                {this.state.error.toString()}
              </div>
            )}

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recharger la page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>Réinitialiser & relancer</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
