// Fallback module declarations to suppress missing type warnings if editor misconfigures search paths
// These should normally be resolved automatically by @types/* packages.

declare module 'react-native-webview' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';
  export interface WebViewProps extends ViewProps {
    source: { uri: string } | { html: string };
    javaScriptEnabled?: boolean;
    domStorageEnabled?: boolean;
    allowsFullscreenVideo?: boolean;
    mediaPlaybackRequiresUserAction?: boolean;
    injectedJavaScript?: string;
    onMessage?: (event: any) => void;
    ref?: any;
    style?: any;
  }
  export class WebView extends React.Component<WebViewProps> {}
}

// Allow iframe intrinsic element on web builds (react-native-web)
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace JSX {
  interface IntrinsicElements {
    iframe: any; // Only used in web target
  }
}
