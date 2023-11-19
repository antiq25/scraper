// reviewImport.js
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* *************************** EXTRACT  ***************************************************/
export const extractRelevantData = (reviews) =>
	reviews.map((item) => ({
		review_id: item.review_id || null,
		reviewer_name: item.reviewer_name || null,
		rating: item.rating || null,
		review_text: item.review_text || "",
		published_at: item.published_at || null,
		published_at_date: item.published_at_date || null,
	}));

	
/* ***************************  SEND ***************************************************/
export const importReviews = async (filePath) => {
	try {
		const jsonData = JSON.parse(readFileSync(filePath, "utf8"));
		const allReviews = jsonData.map((place) => place.detailed_reviews).flat();
		const relevantData = extractRelevantData(allReviews);

		for (const item of relevantData) {
			if (item.reviewer_name) {
				const uniqueReviewId =
					"review_" + Math.random().toString(36).substr(2, 9); // Example ID generation
				await prisma.review.create({
					data: {
						review_id: uniqueReviewId,
						reviewer_name: item.reviewer_name,
						rating: item.rating,
						review_text: item.review_text,
						published_at: item.published_at,
						published_at_date: new Date(item.published_at_date),
					},
				});
			} else {
				console.error("Skipping record without reviewer_name:", item);
			}
		}

		return { message: "Data imported successfully" };
	} catch (error) {
		console.error("Error in importReviews:", error);
		throw error;
	}
};

