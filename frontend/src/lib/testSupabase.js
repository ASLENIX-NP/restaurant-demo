import { supabase } from "./lib/supabase";

export const testConnection = async() => {
    const { data, error } = await supabase
        .from("categories")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);
};