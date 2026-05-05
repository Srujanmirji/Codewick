import Session from '@/models/Session';
import mongoose from 'mongoose';

export async function checkFraud(userId: string, partnerId: string, action: 'request' | 'rate') {
  if (userId === partnerId) {
    return { isFraud: true, message: "Self-trading is strictly prohibited." };
  }

  // Reciprocal Rating Farming Check
  // Check if they have traded more than 2 times in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const previousSwaps = await Session.countDocuments({
    $or: [
      { providerId: userId, learnerId: partnerId },
      { providerId: partnerId, learnerId: userId }
    ],
    status: 'completed',
    createdAt: { $gte: thirtyDaysAgo }
  });

  if (previousSwaps >= 2) {
    return { 
      isFraud: true, 
      message: "Reciprocal trading detected. To prevent rating farming, swaps between the same two users are limited to 2 per month." 
    };
  }

  if (action === 'rate') {
    // Suspicious Rating Pattern Check
    // Check if user has given 5-star ratings to the same person repeatedly
    const highRatings = await Session.countDocuments({
      $or: [
        { providerId: partnerId, learnerId: userId, providerRating: 5 },
        { providerId: userId, learnerId: partnerId, learnerRating: 5 }
      ],
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (highRatings >= 3) {
        return { isFraud: true, message: "Suspicious rating pattern detected. High ratings between frequent partners are flagged." };
    }
  }

  return { isFraud: false };
}
