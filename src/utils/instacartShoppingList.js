import { supabase } from '../lib/supabase';
import { Browser } from '@capacitor/browser';

// Calls the instacart-shopping-list Supabase Edge Function (see
// supabase/functions/instacart-shopping-list) rather than Instacart's API
// directly -- the Instacart API key is a real secret and has to stay
// server-side, never shipped in the client bundle. The function itself
// returns 503 with a friendly message until INSTACART_API_KEY is set as a
// Supabase secret, so this can ship now and just start working the moment
// that key is added -- no client-side code changes needed.
//
// `items` is buildShoppingList's output ({ name, unit, quantity }[], see
// utils/shoppingList.js) -- passed straight through, the edge function
// handles the unit mapping.
export async function getInstacartShoppingLink(title, items) {
  const { data, error } = await supabase.functions.invoke('instacart-shopping-list', {
    body: { title, items },
  });
  if (error) {
    // supabase-js puts the function's actual JSON error body on
    // error.context (a Response), not on `error` itself.
    let message = 'Could not create a shopping link right now.';
    try {
      const body = await error.context.json();
      if (body?.error) message = body.error;
    } catch {
      // Body wasn't JSON (e.g. a network-level failure) -- keep the
      // generic message above.
    }
    throw new Error(message);
  }
  return data.products_link_url;
}

// Opens a URL in the native in-app browser sheet (Safari View Controller
// on iOS) rather than navigating the app's own WebView away or falling
// back to whatever window.open does inside a Capacitor WKWebView -- the
// person stays inside QuickPrep's context and can dismiss back to it
// instead of the app itself getting replaced.
export async function openInBrowser(url) {
  await Browser.open({ url });
}
