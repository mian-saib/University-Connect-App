import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    // Create Supabase client to fetch FAQs
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Fetching FAQs from database...");
    
    // Fetch all active FAQs from the database
    const { data: faqs, error: faqError } = await supabase
      .from("faqs")
      .select("question, answer, category")
      .eq("is_active", true);

    if (faqError) {
      console.error("Error fetching FAQs:", faqError);
      throw new Error("Failed to fetch FAQ data");
    }

    console.log(`Loaded ${faqs?.length || 0} FAQs from database`);

    // Build dynamic FAQ context from database
    const faqContext = faqs?.reduce((acc, faq) => {
      const categoryKey = faq.category.toUpperCase();
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(`Q: ${faq.question}\nA: ${faq.answer}`);
      return acc;
    }, {} as Record<string, string[]>);

    const formattedFaqData = Object.entries(faqContext || {})
      .map(([category, items]) => `${category}:\n${(items as string[]).join("\n\n")}`)
      .join("\n\n");

    console.log("Processing FAQ question:", message);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are the official FAQ Assistant for University of Peshawar, Pakistan. You answer questions using the knowledge base provided below.

IMPORTANT RULES:
1. Answer questions about University of Peshawar based on the FAQ data provided
2. If a question is not related to the university or not in your knowledge base, politely redirect: "I can only help with University of Peshawar related questions. Please ask about admissions, fees, academics, hostels, IT support, or student services."
3. Be friendly, professional, and concise
4. Use Pakistani context (PKR currency, local terms)
5. Include relevant contact information when helpful
6. If unsure, suggest contacting the relevant office directly

UNIVERSITY OF PESHAWAR FAQ KNOWLEDGE BASE:

${formattedFaqData}`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I apologize, I couldn't process your question. Please try again.";

    console.log("FAQ response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in faq-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        response: "I apologize, but I'm having trouble responding right now. Please try again or contact the university directly at info@uop.edu.pk for assistance."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
