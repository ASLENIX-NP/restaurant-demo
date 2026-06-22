import { supabase } from "../lib/supabase";

export const getCategories = async() => {
    const response = await supabase
        .from("categories")
        .select("*");

    console.log("FULL RESPONSE");
    console.log(response);

    return response.data;
};
