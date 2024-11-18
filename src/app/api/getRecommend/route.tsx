import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import OpenAI from "openai";

// Import the Opportunity and IUser models
import { Opportunity } from "@/app/models/opportunities/Opportunity";
import { IUser as UserData } from "@/app/models/users/IUser";

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY!,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const limitParam = searchParams.get("limit");
  const limitCount = limitParam ? parseInt(limitParam, 10) : 8;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch user details
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserData | undefined;

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userInterests = userData.interests || [];
    const userBiography = userData.biography || "No biography available.";

    // Fetch opportunities ordered by date
    const opportunitiesQuery = query(
      collection(db, "opportunities"),
      orderBy("date", "desc")
    );
    const opportunitiesSnapshot = await getDocs(opportunitiesQuery);

    const opportunities: Opportunity[] = [];

    for (const doc of opportunitiesSnapshot.docs) {
      const data = doc.data();

      // Ensure that all required fields exist before pushing into the array
      if (
        data.title &&
        data.description &&
        data.imageUrl &&
        data.date &&
        data.criteria !== undefined &&
        data.location &&
        data.registrationDeadline &&
        data.additionalInformation &&
        data.category &&
        data.createdDate &&
        data.createdBy &&
        data.status &&
        data.agency
      ) {
        // Add the opportunity to the list
        opportunities.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          date: data.date,
          criteria: data.criteria,
          duration: data.duration,
          location: data.location,
          registrationDeadline: data.registrationDeadline,
          additionalInformation: data.additionalInformation,
          category: data.category,
          createdDate: data.createdDate,
          createdBy: data.createdBy,
          lastEditedDate: data.lastEditedDate,
          lastEditedBy: data.lastEditedBy,
          status: data.status,
          agency: data.agency,
        });
      }
    }

    // OpenAI prompt to recommend opportunities based on user profile
    const prompt = `
    You are an assistant helping to recommend volunteer opportunities to users based on their interests and biography.
    The user's biography is: "${userBiography}"
    The user has the following interests: ${userInterests.join(", ")}.

    Here is a list of opportunities:
    ${opportunities
      .map(
        (o) =>
          `Title: ${o.title}, Location: ${o.location}, Description: ${o.description}`
      )
      .join("\n")}

    Based on the user's biography and interests, return a ranked list of opportunity titles (or IDs) in the order of most recommended to least recommended, without any additional text, just the list.
    `;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const recommendationText =
      gptResponse.choices?.[0]?.message.content?.trim() || "";

    // Extract the list of recommended opportunity titles from the GPT response
    const recommendedTitles = recommendationText
      .split("\n")
      .map((title) => title.trim());

    // Sort the local opportunities based on the recommendations
    const sortedOpportunities = opportunities.sort((a, b) => {
      const indexA = recommendedTitles.indexOf(a.title);
      const indexB = recommendedTitles.indexOf(b.title);

      // If either title is not found, move it to the end of the list
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      // Otherwise, sort based on the GPT-provided rank
      return indexA - indexB;
    });

    // Limit the recommendations to the specified limit
    const limitedRecommendations = sortedOpportunities.slice(0, limitCount);

    return NextResponse.json({ opportunities: limitedRecommendations });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
