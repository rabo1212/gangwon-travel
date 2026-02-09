import { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">앗, 문제가 생겼어요</h2>
            <p className="text-gray-500 text-sm mb-6">
              여행 루트를 만드는 중에 오류가 발생했어요.
              처음부터 다시 시작해볼까요?
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066CC] text-white rounded-2xl font-bold hover:bg-[#0055aa] transition-colors active:scale-95 transform"
            >
              <RotateCcw className="w-5 h-5" />
              처음부터 다시 하기
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
