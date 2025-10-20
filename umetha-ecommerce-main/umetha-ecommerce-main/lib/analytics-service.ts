/**
 * UMetha E-commerce Analytics Service
 * Centralized analytics tracking for user behavior, product interactions, and business metrics
 */

type EventType =
  | "pageView"
  | "productView"
  | "addToCart"
  | "removeFromCart"
  | "beginCheckout"
  | "purchase"
  | "search"
  | "filter"
  | "influencerClick"
  | "recommendationClick"
  | "virtualRoomInteraction"
  | "signup"
  | "login"
  // Cart abandonment events
  | "cartAbandon" 
  | "exitIntent"
  | "saveCart"
  | "returnToCart"
  // Personalization & upselling events
  | "productAffinity"
  | "browseHistory"
  | "crossSellClick"
  | "segmentActivity"
  // Performance events
  | "pageLoadPerformance"
  | "apiPerformance"
  | "componentRender"
  // User journey events
  | "funnelStep"
  | "userJourney"
  // A/B testing events
  | "experimentView"
  | "experimentConversion"
  // Heatmap & session events
  | "click"
  | "scroll"
  | "mouseMovement"
  | "formInteraction";

// Interfaces for analytics events
interface AnalyticsEvent {
  type: EventType;
  timestamp: number;
  userId?: string;
  sessionId: string;
  properties: Record<string, any>;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  variant?: string;
}

interface PurchaseData {
  transactionId: string;
  revenue: number;
  tax?: number;
  shipping?: number;
  coupon?: string;
  products: ProductData[];
}

// New interfaces for enhanced analytics
interface PerformanceData {
  duration: number;
  endpoint?: string;
  component?: string;
  context?: Record<string, any>;
}

interface ExperimentData {
  experimentId: string;
  variant: string;
  page?: string;
}

interface HeatmapData {
  x: number;
  y: number;
  elementId?: string;
  elementType?: string;
  viewportWidth?: number;
  viewportHeight?: number;
}

interface FunnelData {
  funnelId: string;
  stepId: string;
  stepPosition: number;
  totalSteps: number;
}

interface CartAbandonmentData {
  cartId: string;
  cartValue: number;
  productCount: number;
  abandonStage: string;
  recoveryMethod?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];
  private processingQueue: boolean = false;
  private debugMode: boolean = process.env.NODE_ENV === "development";
  private sessionStart: number;
  private lastActivity: number;
  private pageLoadTimestamp: number;
  private experimentVariants: Record<string, string> = {};
  private recordingActive: boolean = false;
  private mouseMovements: HeatmapData[] = [];
  private clickData: HeatmapData[] = [];
  private scrollPositions: {position: number, timestamp: number}[] = [];
  private userSegment?: string;
  private currentFunnelId?: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
    this.pageLoadTimestamp = Date.now();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize analytics providers
   */
  public init(): void {
    if (this.initialized) return;

    try {
      // Initialize Google Analytics (GA4)
      if (typeof window !== "undefined" && typeof window.gtag === "undefined") {
        // Placeholder for GA4 initialization
        console.log("[Analytics] Google Analytics initialized");
      }

      // Initialize Hotjar for heatmaps and session recording
      this.initHotjar();
      
      // Initialize A/B testing framework
      this.initExperiments();
      
      // Set up session event listeners
      this.setupSessionListeners();
      
      // Initialize performance monitoring
      this.initPerformanceMonitoring();

      this.initialized = true;

      // Process any events that were queued before initialization
      this.processQueue();
    } catch (error) {
      console.error("[Analytics] Initialization error:", error);
    }
  }

  /**
   * Initialize Hotjar for heatmaps and session recording
   */
  private initHotjar(): void {
    if (typeof window === "undefined") return;
    
    // Hotjar initialization code would typically go here
    console.log("[Analytics] Heatmaps and session recording initialized");
    
    // Start recording session if opted in
    if (this.isUserOptedIn("session_recording")) {
      this.startSessionRecording();
    }
  }
  
  /**
   * Initialize A/B testing framework
   */
  private initExperiments(): void {
    if (typeof window === "undefined") return;
    
    // Load active experiments from API or local storage
    const storedExperiments = localStorage.getItem("umetha_experiments");
    if (storedExperiments) {
      try {
        this.experimentVariants = JSON.parse(storedExperiments);
      } catch (e) {
        console.error("[Analytics] Failed to parse experiments", e);
      }
    } else {
      // In a real implementation, we would fetch active experiments from the server
      fetch("/api/experiments/active")
        .then(res => res.json())
        .then(data => {
          this.experimentVariants = data;
          localStorage.setItem("umetha_experiments", JSON.stringify(data));
        })
        .catch(err => console.error("[Analytics] Failed to fetch experiments", err));
    }
  }

  /**
   * Set up session event listeners for user interactions
   */
  private setupSessionListeners(): void {
    if (typeof window === "undefined") return;
    
    // Track user activity
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach(event => {
      window.addEventListener(event, () => {
        this.lastActivity = Date.now();
      });
    });
    
    // Track exit intent
    document.addEventListener("mouseleave", (event) => {
      // Check if the mouse is leaving the top of the page
      if (event.clientY < 10) {
        this.trackExitIntent({
          cartValue: this.getCurrentCartValue(),
          pageUrl: window.location.href
        });
      }
    });
    
    // Track clicks for heatmap
    document.addEventListener("click", (event) => {
      if (!this.recordingActive) return;
      
      const target = event.target as HTMLElement;
      const heatmapData: HeatmapData = {
        x: event.clientX,
        y: event.clientY,
        elementId: target.id || undefined,
        elementType: target.tagName.toLowerCase(),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
      
      this.clickData.push(heatmapData);
      this.track("click", heatmapData);
    });
    
    // Track mouse movement (throttled)
    let lastMove = 0;
    document.addEventListener("mousemove", (event) => {
      if (!this.recordingActive) return;
      
      const now = Date.now();
      // Only capture every 500ms to avoid overwhelming data
      if (now - lastMove > 500) {
        lastMove = now;
        const heatmapData: HeatmapData = {
          x: event.clientX,
          y: event.clientY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        };
        
        this.mouseMovements.push(heatmapData);
        // We don't send each movement to avoid too many events
        // Instead batch send periodically
      }
    });
    
    // Track scroll depth (throttled)
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      if (!this.recordingActive) return;
      
      const now = Date.now();
      // Only capture every 500ms to avoid overwhelming data
      if (now - lastScroll > 500) {
        lastScroll = now;
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(
          document.body.scrollHeight, 
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        this.scrollPositions.push({
          position: scrollPercent,
          timestamp: now
        });
        
        this.track("scroll", {
          scrollDepth: scrollPercent,
          pageUrl: window.location.pathname
        });
      }
    });
    
    // Track form interactions
    document.addEventListener("focusin", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") {
        this.track("formInteraction", {
          action: "focus",
          formId: this.getFormId(target),
          fieldType: target.tagName.toLowerCase(),
          fieldId: target.id || undefined,
          fieldName: (target as HTMLInputElement).name || undefined
        });
      }
    });
    
    // Track form submissions
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      this.track("formInteraction", {
        action: "submit",
        formId: form.id || undefined,
        formAction: form.action || undefined
      });
    });
    
    // Set up page unload tracking for cart abandonment
    window.addEventListener("beforeunload", () => {
      // Check if cart has items and user is in checkout flow
      if (this.isInCheckoutFlow() && this.hasCartItems()) {
        this.trackCartAbandon({
          cartId: this.getCartId(),
          cartValue: this.getCurrentCartValue(),
          productCount: this.getCartItemCount(),
          abandonStage: window.location.pathname
        });
        
        // Save cart state for potential recovery
        this.saveCartForRecovery();
      }
      
      // Send all pending session data
      this.sendBatchedSessionData();
    });
    
    // Set up periodic inactivity check
    setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivity;
      // If inactive for more than 30 minutes, consider the session abandoned
      if (inactiveTime > 30 * 60 * 1000) {
        // Check if cart has items
        if (this.hasCartItems()) {
          this.trackCartAbandon({
            cartId: this.getCartId(),
            cartValue: this.getCurrentCartValue(),
            productCount: this.getCartItemCount(),
            abandonStage: "inactive"
          });
        }
      }
      
      // Send batched session data every 5 minutes
      if (this.recordingActive && inactiveTime < 10 * 60 * 1000) { // Only if active in last 10 mins
        this.sendBatchedSessionData();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
  
  /**
   * Initialize performance monitoring
   */
  private initPerformanceMonitoring(): void {
    if (typeof window === "undefined" || !window.performance) return;
    
    // Track page load performance
    window.addEventListener("load", () => {
      // Wait for things to settle
      setTimeout(() => {
        const perfData = this.collectPerformanceData();
        this.trackPagePerformance(perfData);
      }, 100);
    });
    
    // Set up PerformanceObserver for ongoing metrics
    if ("PerformanceObserver" in window) {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach(entry => {
          this.trackPerformanceMetric(entry);
        });
      });
      paintObserver.observe({ type: "paint", buffered: true });
      
      // Observe resource loading
      const resourceObserver = new PerformanceObserver((entries) => {
        entries.getEntries().forEach(entry => {
          if ((entry as PerformanceResourceTiming).initiatorType === "fetch" || 
              (entry as PerformanceResourceTiming).initiatorType === "xmlhttprequest") {
            this.trackApiPerformance(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ type: "resource", buffered: true });
    }
  }

  /**
   * Track page view with optional custom properties
   */
  public trackPageView(
    path: string,
    properties: Record<string, any> = {}
  ): void {
    this.track("pageView", {
      path,
      title: document.title,
      referrer: document.referrer,
      ...properties,
    });
    
    // Reset page load timestamp for performance tracking
    this.pageLoadTimestamp = Date.now();
    
    // Check if this page is part of an active funnel
    this.checkAndTrackFunnelStep(path);
    
    // Track active experiment variants for this page
    this.trackActiveExperiments(path);
  }

  /**
   * Track product view
   */
  public trackProductView(product: ProductData): void {
    this.track("productView", { product });
    
    // Add to browse history for personalization
    this.addToBrowseHistory(product);
  }

  /**
   * Track add to cart
   */
  public trackAddToCart(product: ProductData, quantity: number): void {
    this.track("addToCart", { product, quantity });
  }

  /**
   * Track remove from cart
   */
  public trackRemoveFromCart(product: ProductData, quantity: number): void {
    this.track("removeFromCart", { product, quantity });
  }

  /**
   * Track checkout initiation
   */
  public trackBeginCheckout(products: ProductData[], value: number): void {
    this.track("beginCheckout", { products, value });
    
    // Start funnel tracking for checkout
    this.startFunnelTracking("checkout", "begin_checkout");
  }

  /**
   * Track purchase completion
   */
  public trackPurchase(purchaseData: PurchaseData): void {
    this.track("purchase", purchaseData);
    
    // Complete funnel if active
    if (this.currentFunnelId === "checkout") {
      this.trackFunnelStep("checkout", "complete", 5, 5);
      this.currentFunnelId = undefined;
    }
    
    // Track conversion for any active experiments
    Object.keys(this.experimentVariants).forEach(experimentId => {
      this.trackExperimentConversion(experimentId, purchaseData.revenue);
    });
    
    // Update product affinity data based on purchase
    this.updateProductAffinityData(purchaseData.products);
  }

  /**
   * Track search
   */
  public trackSearch(query: string, resultsCount: number): void {
    this.track("search", { query, resultsCount });
  }

  /**
   * Track influencer interaction
   */
  public trackInfluencerClick(
    influencerId: string,
    influencerName: string,
    productId?: string
  ): void {
    this.track("influencerClick", { influencerId, influencerName, productId });
  }

  /**
   * Track recommendation click
   */
  public trackRecommendationClick(
    productId: string,
    recommendationType: string,
    position: number
  ): void {
    this.track("recommendationClick", {
      productId,
      recommendationType,
      position,
    });
  }

  /**
   * Track virtual room interaction
   */
  public trackVirtualRoomInteraction(
    interactionType: string,
    productId?: string
  ): void {
    this.track("virtualRoomInteraction", { interactionType, productId });
  }

  // New tracking methods for cart abandonment

  /**
   * Track cart abandonment
   */
  public trackCartAbandon(data: CartAbandonmentData): void {
    this.track("cartAbandon", data);
  }

  /**
   * Track exit intent (user about to leave page with items in cart)
   */
  public trackExitIntent(properties: Record<string, any> = {}): void {
    this.track("exitIntent", properties);
  }

  /**
   * Track saving cart for later recovery
   */
  public trackSaveCart(cartId: string, email?: string): void {
    this.track("saveCart", { cartId, email });
  }

  /**
   * Track user returning to an abandoned cart
   */
  public trackReturnToCart(cartId: string, recoveryMethod: string): void {
    this.track("returnToCart", { cartId, recoveryMethod });
  }

  // New tracking methods for personalization and upselling

  /**
   * Track product affinity (products frequently viewed/purchased together)
   */
  public trackProductAffinity(productId: string, affinityProductId: string, strength: number): void {
    this.track("productAffinity", { productId, affinityProductId, strength });
  }

  /**
   * Track product browse history
   */
  public trackBrowseHistory(productId: string, category: string): void {
    this.track("browseHistory", { productId, category });
  }

  /**
   * Track cross-sell click
   */
  public trackCrossSellClick(
    sourceProductId: string, 
    targetProductId: string,
    recommendationType: string
  ): void {
    this.track("crossSellClick", {
      sourceProductId,
      targetProductId,
      recommendationType
    });
  }

  /**
   * Track user segment activity
   */
  public trackSegmentActivity(segmentId: string, activity: string): void {
    this.track("segmentActivity", { segmentId, activity });
  }

  // New tracking methods for performance

  /**
   * Track page load performance
   */
  public trackPagePerformance(performanceData: PerformanceData): void {
    this.track("pageLoadPerformance", performanceData);
  }

  /**
   * Track API call performance
   */
  public trackApiPerformance(resourceTiming: PerformanceResourceTiming): void {
    this.track("apiPerformance", {
      endpoint: resourceTiming.name,
      duration: resourceTiming.duration,
      size: resourceTiming.transferSize,
      protocol: resourceTiming.nextHopProtocol,
      timing: {
        startTime: resourceTiming.startTime,
        responseStart: resourceTiming.responseStart,
        responseEnd: resourceTiming.responseEnd
      }
    });
  }

  /**
   * Track component render performance
   */
  public trackComponentRender(componentName: string, duration: number): void {
    this.track("componentRender", {
      component: componentName,
      duration,
      timestamp: Date.now()
    });
  }

  // New tracking methods for user journey

  /**
   * Start tracking a funnel
   */
  public startFunnelTracking(funnelId: string, stepId: string): void {
    this.currentFunnelId = funnelId;
    this.trackFunnelStep(funnelId, stepId, 1, 5); // Assuming 5 steps for checkout
  }

  /**
   * Track funnel step
   */
  public trackFunnelStep(
    funnelId: string,
    stepId: string,
    stepPosition: number,
    totalSteps: number
  ): void {
    this.track("funnelStep", {
      funnelId,
      stepId,
      stepPosition,
      totalSteps,
      timestamp: Date.now()
    });
  }

  /**
   * Track user journey path
   */
  public trackUserJourney(
    fromPage: string,
    toPage: string,
    interactionType: string
  ): void {
    this.track("userJourney", {
      fromPage,
      toPage,
      interactionType,
      timestamp: Date.now()
    });
  }

  // New tracking methods for A/B testing

  /**
   * Set up an experiment variant for the current user
   */
  public setExperimentVariant(experimentId: string, variant: string): void {
    this.experimentVariants[experimentId] = variant;
    
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "umetha_experiments", 
        JSON.stringify(this.experimentVariants)
      );
    }
  }

  /**
   * Get the current variant for an experiment
   */
  public getExperimentVariant(experimentId: string): string | undefined {
    return this.experimentVariants[experimentId];
  }

  /**
   * Track experiment view
   */
  public trackExperimentView(experimentData: ExperimentData): void {
    this.track("experimentView", experimentData);
  }

  /**
   * Track experiment conversion
   */
  public trackExperimentConversion(
    experimentId: string, 
    conversionValue?: number
  ): void {
    const variant = this.experimentVariants[experimentId];
    if (!variant) return;
    
    this.track("experimentConversion", {
      experimentId,
      variant,
      conversionValue,
      page: typeof window !== "undefined" ? window.location.pathname : undefined
    });
  }

  /**
   * Start recording the user's session
   */
  public startSessionRecording(): void {
    this.recordingActive = true;
    console.log("[Analytics] Session recording started");
  }

  /**
   * Stop recording the user's session
   */
  public stopSessionRecording(): void {
    this.recordingActive = false;
    
    // Send any remaining data
    this.sendBatchedSessionData();
    
    console.log("[Analytics] Session recording stopped");
  }

  /**
   * Send batched session data to backend
   */
  private sendBatchedSessionData(): void {
    if (!this.recordingActive || 
        (this.mouseMovements.length === 0 && 
         this.clickData.length === 0 && 
         this.scrollPositions.length === 0)) {
      return;
    }
    
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.getUserId(),
      timestamp: Date.now(),
      page: typeof window !== "undefined" ? window.location.pathname : "",
      mouseMovements: [...this.mouseMovements],
      clicks: [...this.clickData],
      scrollPositions: [...this.scrollPositions]
    };
    
    // Clear local stores
    this.mouseMovements = [];
    this.clickData = [];
    this.scrollPositions = [];
    
    // Send to backend
    fetch("/api/analytics/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sessionData)
    }).catch(error => {
      console.error("[Analytics] Failed to send session data", error);
    });
  }

  /**
   * Check if user is in checkout flow
   */
  private isInCheckoutFlow(): boolean {
    if (typeof window === "undefined") return false;
    
    const checkoutPaths = ["/cart", "/checkout"];
    return checkoutPaths.some(path => window.location.pathname.includes(path));
  }

  /**
   * Check if cart has items
   */
  private hasCartItems(): boolean {
    if (typeof window === "undefined") return false;
    
    // Try to get cart data from local storage
    const cartData = localStorage.getItem("umetha_cart");
    if (!cartData) return false;
    
    try {
      const cart = JSON.parse(cartData);
      return Array.isArray(cart.items) && cart.items.length > 0;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get current cart value
   */
  private getCurrentCartValue(): number {
    if (typeof window === "undefined") return 0;
    
    // Try to get cart data from local storage
    const cartData = localStorage.getItem("umetha_cart");
    if (!cartData) return 0;
    
    try {
      const cart = JSON.parse(cartData);
      return cart.totalAmount || 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Get cart item count
   */
  private getCartItemCount(): number {
    if (typeof window === "undefined") return 0;
    
    // Try to get cart data from local storage
    const cartData = localStorage.getItem("umetha_cart");
    if (!cartData) return 0;
    
    try {
      const cart = JSON.parse(cartData);
      return Array.isArray(cart.items) ? cart.items.length : 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Get cart ID
   */
  private getCartId(): string {
    if (typeof window === "undefined") return "";
    
    // Try to get cart data from local storage
    let cartId = localStorage.getItem("umetha_cart_id");
    
    if (!cartId) {
      cartId = "cart_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("umetha_cart_id", cartId);
    }
    
    return cartId;
  }

  /**
   * Save cart for potential recovery
   */
  private saveCartForRecovery(): void {
    if (typeof window === "undefined") return;
    
    const cartData = localStorage.getItem("umetha_cart");
    if (!cartData) return;
    
    const cartId = this.getCartId();
    
    // In a real implementation, this would be sent to the server
    // For now just save to session storage as an example
    sessionStorage.setItem(`umetha_saved_cart_${cartId}`, cartData);
    
    this.trackSaveCart(cartId);
  }

  /**
   * Add to browse history for personalization
   */
  private addToBrowseHistory(product: ProductData): void {
    if (typeof window === "undefined") return;
    
    // Get existing browse history
    const historyJson = localStorage.getItem("umetha_browse_history");
    let history: ProductData[] = [];
    
    if (historyJson) {
      try {
        history = JSON.parse(historyJson);
        if (!Array.isArray(history)) history = [];
      } catch (e) {
        history = [];
      }
    }
    
    // Check if product already in history
    const existingIndex = history.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      // Move to top of history
      history.splice(existingIndex, 1);
    }
    
    // Add to top
    history.unshift(product);
    
    // Keep only last 20 items
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    localStorage.setItem("umetha_browse_history", JSON.stringify(history));
    
    this.trackBrowseHistory(product.id, product.category || "");
  }

  /**
   * Update product affinity data based on purchases
   */
  private updateProductAffinityData(products: ProductData[]): void {
    if (products.length <= 1) return;
    
    // Calculate affinities between all product pairs
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        // In a real implementation, these affinities would be saved to a DB
        // Here we just track the event for collection
        this.trackProductAffinity(
          products[i].id,
          products[j].id,
          1.0 // Purchase together is strongest affinity
        );
      }
    }
  }

  /**
   * Check if current page is part of an active funnel and track it
   */
  private checkAndTrackFunnelStep(path: string): void {
    // Check if we're in an active funnel
    if (!this.currentFunnelId) return;
    
    // Define funnel paths (this would typically come from a config)
    const checkoutFunnel = {
      id: "checkout",
      steps: [
        { id: "cart", path: "/cart", position: 1 },
        { id: "checkout_info", path: "/checkout", position: 2 },
        { id: "shipping", path: "/checkout/shipping", position: 3 },
        { id: "payment", path: "/checkout/payment", position: 4 },
        { id: "confirmation", path: "/checkout/confirmation", position: 5 }
      ]
    };
    
    // Check if current path matches a funnel step
    if (this.currentFunnelId === "checkout") {
      const step = checkoutFunnel.steps.find(s => path.includes(s.path));
      if (step) {
        this.trackFunnelStep(
          checkoutFunnel.id,
          step.id,
          step.position,
          checkoutFunnel.steps.length
        );
      }
    }
  }

  /**
   * Track active experiment variants for current page
   */
  private trackActiveExperiments(path: string): void {
    // For each active experiment
    Object.keys(this.experimentVariants).forEach(experimentId => {
      const variant = this.experimentVariants[experimentId];
      
      this.trackExperimentView({
        experimentId,
        variant,
        page: path
      });
    });
  }

  /**
   * Collect performance data from the browser
   */
  private collectPerformanceData(): PerformanceData {
    if (typeof window === "undefined" || !window.performance) {
      return { duration: 0 };
    }
    
    const now = Date.now();
    const pageLoadTime = now - this.pageLoadTimestamp;
    
    let performanceData: PerformanceData = {
      duration: pageLoadTime
    };
    
    try {
      // Get navigation timing if available
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navigation) {
        performanceData = {
          duration: pageLoadTime,
          context: {
            domComplete: navigation.domComplete,
            loadEventEnd: navigation.loadEventEnd,
            domInteractive: navigation.domInteractive,
            domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint(),
            largestContentfulPaint: this.getLargestContentfulPaint()
          }
        };
      }
    } catch (e) {
      console.error("[Analytics] Error collecting performance data", e);
    }
    
    return performanceData;
  }

  /**
   * Track a specific performance metric entry
   */
  private trackPerformanceMetric(entry: PerformanceEntry): void {
    this.track("pageLoadPerformance", {
      duration: entry.duration || entry.startTime,
      component: entry.name,
      context: {
        entryType: entry.entryType,
        startTime: entry.startTime
      }
    });
  }

  /**
   * Get First Paint metric
   */
  private getFirstPaint(): number {
    if (typeof performance === "undefined") return 0;
    
    const paintMetrics = performance.getEntriesByType("paint");
    const firstPaint = paintMetrics.find(entry => entry.name === "first-paint");
    return firstPaint ? firstPaint.startTime : 0;
  }

  /**
   * Get First Contentful Paint metric
   */
  private getFirstContentfulPaint(): number {
    if (typeof performance === "undefined") return 0;
    
    const paintMetrics = performance.getEntriesByType("paint");
    const firstContentfulPaint = paintMetrics.find(
      entry => entry.name === "first-contentful-paint"
    );
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  /**
   * Get Largest Contentful Paint metric
   */
  private getLargestContentfulPaint(): number {
    // LCP needs PerformanceObserver, return 0 if not available
    return 0;
  }

  /**
   * Get form ID or generate one if not available
   */
  private getFormId(element: HTMLElement): string {
    let form: HTMLElement | null = element;
    while (form && form.tagName !== "FORM") {
      form = form.parentElement;
    }
    
    if (!form) return "unknown_form";
    
    return (form as HTMLFormElement).id || 
      (form as HTMLFormElement).getAttribute("name") || 
      `form_${window.location.pathname.replace(/\//g, "_")}`;
  }

  /**
   * Check if user has opted in to a specific feature
   */
  private isUserOptedIn(feature: string): boolean {
    if (typeof window === "undefined") return false;
    
    // Check for stored consent preferences
    const consent = localStorage.getItem("umetha_analytics_consent");
    if (!consent) return false;
    
    try {
      const consentObj = JSON.parse(consent);
      return consentObj[feature] === true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Update user's consent preferences
   */
  public updateConsentPreferences(preferences: Record<string, boolean>): void {
    if (typeof window === "undefined") return;
    
    // Get current preferences
    const currentConsent = localStorage.getItem("umetha_analytics_consent");
    let consentObj = {};
    
    if (currentConsent) {
      try {
        consentObj = JSON.parse(currentConsent);
      } catch (e) {
        consentObj = {};
      }
    }
    
    // Update with new preferences
    const updatedConsent = {
      ...consentObj,
      ...preferences
    };
    
    localStorage.setItem("umetha_analytics_consent", JSON.stringify(updatedConsent));
    
    // Apply changes immediately
    if (preferences.session_recording === true && !this.recordingActive) {
      this.startSessionRecording();
    } else if (preferences.session_recording === false && this.recordingActive) {
      this.stopSessionRecording();
    }
  }

  /**
   * Set user segment for personalization
   */
  public setUserSegment(segmentId: string): void {
    this.userSegment = segmentId;
    
    if (typeof window !== "undefined") {
      localStorage.setItem("umetha_user_segment", segmentId);
    }
  }

  /**
   * Get user's current segment
   */
  public getUserSegment(): string | undefined {
    if (this.userSegment) return this.userSegment;
    
    if (typeof window !== "undefined") {
      return localStorage.getItem("umetha_user_segment") || undefined;
    }
    
    return undefined;
  }

  /**
   * Generic event tracking method
   */
  private track(type: EventType, properties: Record<string, any>): void {
    // Create the event object
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      properties,
    };

    // Add user ID if available
    const userId = this.getUserId();
    if (userId) {
      event.userId = userId;
    }
    
    // Add user segment if available
    const segment = this.getUserSegment();
    if (segment) {
      event.properties.userSegment = segment;
    }

    // If debugging, log the event
    if (this.debugMode) {
      console.log("[Analytics]", type, properties);
    }

    // If not initialized, queue the event for later
    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    // Send to Google Analytics
    this.sendToGoogleAnalytics(event);
    
    // Send to Mixpanel if available
    this.sendToMixpanel(event);

    // Send to backend for our own analytics
    this.sendToBackend(event);
  }

  /**
   * Send event to Google Analytics (GA4)
   */
  private sendToGoogleAnalytics(event: AnalyticsEvent): void {
    if (typeof window === "undefined" || typeof window.gtag === "undefined")
      return;

    // Map our event types to GA4 event names
    const eventMapping: Record<EventType, string> = {
      pageView: "page_view",
      productView: "view_item",
      addToCart: "add_to_cart",
      removeFromCart: "remove_from_cart",
      beginCheckout: "begin_checkout",
      purchase: "purchase",
      search: "search",
      filter: "filter",
      influencerClick: "influencer_click",
      recommendationClick: "recommendation_click",
      virtualRoomInteraction: "virtual_room_interaction",
      signup: "sign_up",
      login: "login",
      
      // Map new events
      cartAbandon: "cart_abandon",
      exitIntent: "exit_intent",
      saveCart: "save_cart",
      returnToCart: "return_to_cart",
      
      productAffinity: "product_affinity",
      browseHistory: "browse_history",
      crossSellClick: "cross_sell_click",
      segmentActivity: "segment_activity",
      
      pageLoadPerformance: "page_performance",
      apiPerformance: "api_performance",
      componentRender: "component_render",
      
      funnelStep: "funnel_step",
      userJourney: "user_journey",
      
      experimentView: "experiment_view",
      experimentConversion: "experiment_conversion",
      
      click: "click",
      scroll: "scroll",
      mouseMovement: "mouse_movement",
      formInteraction: "form_interaction"
    };

    // Send to GA4
    try {
      window.gtag("event", eventMapping[event.type] || event.type, {
        ...event.properties,
        session_id: event.sessionId,
      });
    } catch (error) {
      console.error("[Analytics] GA4 send error:", error);
    }
  }
  
  /**
   * Send event to Mixpanel
   */
  private sendToMixpanel(event: AnalyticsEvent): void {
    if (typeof window === "undefined" || !window.mixpanel) return;
    
    try {
      window.mixpanel.track(event.type, {
        ...event.properties,
        session_id: event.sessionId,
        user_id: event.userId
      });
    } catch (error) {
      console.error("[Analytics] Mixpanel send error:", error);
    }
  }

  /**
   * Send event to our backend
   */
  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch (error) {
      console.error("[Analytics] Backend send error:", error);

      // If backend send fails, queue for retry
      this.queue.push(event);
    }
  }

  /**
   * Process queued events
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.queue.length === 0) return;

    this.processingQueue = true;

    const event = this.queue.shift();
    if (event) {
      try {
        await this.sendToBackend(event);
      } catch (error) {
        // If still failing, push back to queue
        this.queue.push(event);
      }
    }

    this.processingQueue = false;

    // If there are more events, process the next one
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    if (typeof window === "undefined") return "";

    // Check if there's already a session ID in storage
    const storedSessionId = localStorage.getItem("umetha_session_id");
    if (storedSessionId) return storedSessionId;

    // Create new session ID
    const newSessionId = "xxxx-xxxx-xxxx-xxxx".replace(/x/g, () => {
      return Math.floor(Math.random() * 16).toString(16);
    });

    // Store in localStorage
    localStorage.setItem("umetha_session_id", newSessionId);

    return newSessionId;
  }

  /**
   * Get user ID from auth context or storage
   */
  private getUserId(): string | undefined {
    if (typeof window === "undefined") return undefined;

    // TODO: Get from auth context if available

    // Otherwise try from storage
    return localStorage.getItem("umetha_user_id") || undefined;
  }

  /**
   * Set user ID when user logs in
   */
  public setUserId(userId: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("umetha_user_id", userId);

    // If GA4 is available, set user ID
    if (typeof window.gtag !== "undefined") {
      window.gtag("set", { user_id: userId });
    }
    
    // If Mixpanel is available, identify user
    if (typeof window.mixpanel !== "undefined") {
      window.mixpanel.identify(userId);
    }
  }

  /**
   * Clear user ID when user logs out
   */
  public clearUserId(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("umetha_user_id");
    
    // Reset mixpanel if available
    if (typeof window.mixpanel !== "undefined") {
      window.mixpanel.reset();
    }
  }
  
  /**
   * Export analytics data for external use
   */
  public async exportAnalyticsData(
    startDate: Date, 
    endDate: Date, 
    eventTypes?: EventType[]
  ): Promise<any> {
    try {
      const response = await fetch("/api/analytics/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          eventTypes: eventTypes || undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Analytics export error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("[Analytics] Export error:", error);
      throw error;
    }
  }
  
  /**
   * Integration with external analytics platforms
   */
  public connectExternalPlatform(
    platformName: string, 
    apiKey: string, 
    options: Record<string, any> = {}
  ): void {
    // Implementation would connect to external platforms like Google Analytics, Mixpanel, etc.
    console.log(`[Analytics] Connecting to ${platformName}`);
    
    // Here we would handle the specific platform connections
    switch (platformName.toLowerCase()) {
      case "mixpanel":
        this.connectMixpanel(apiKey, options);
        break;
      case "amplitude":
        this.connectAmplitude(apiKey, options);
        break;
      case "segment":
        this.connectSegment(apiKey, options);
        break;
      default:
        console.warn(`[Analytics] Platform ${platformName} not supported`);
    }
  }
  
  /**
   * Connect to Mixpanel
   */
  private connectMixpanel(apiKey: string, options: Record<string, any>): void {
    if (typeof window === "undefined") return;
    
    // In a real implementation, we'd load the Mixpanel script here
    console.log("[Analytics] Mixpanel connected with options:", options);
  }
  
  /**
   * Connect to Amplitude
   */
  private connectAmplitude(apiKey: string, options: Record<string, any>): void {
    if (typeof window === "undefined") return;
    
    // In a real implementation, we'd load the Amplitude script here
    console.log("[Analytics] Amplitude connected with options:", options);
  }
  
  /**
   * Connect to Segment
   */
  private connectSegment(writeKey: string, options: Record<string, any>): void {
    if (typeof window === "undefined") return;
    
    // In a real implementation, we'd load the Segment script here
    console.log("[Analytics] Segment connected with options:", options);
  }
}

// Augment the window interface to include gtag and mixpanel
declare global {
  interface Window {
    gtag: any;
    mixpanel: any;
  }
}

// Export singleton instance
export const Analytics = AnalyticsService.getInstance();

// Export types for use elsewhere
export type { 
  EventType, 
  AnalyticsEvent, 
  ProductData, 
  PurchaseData,
  PerformanceData,
  ExperimentData,
  HeatmapData,
  FunnelData,
  CartAbandonmentData 
};
