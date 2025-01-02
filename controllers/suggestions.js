import Workout from "/home/el-piccolo/express/workout-tracker/models/Workouts.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apikey: process.env.OPENAI_API_KEY,
});

// @desc    Get all suggestions
// @route   GET /api/v1/suggestions
// @access  Private
export const getSuggestions = async (req, res, next) => {
  try {
    const workoutHistory = await Workout.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("exercises");

    const formattedWorkoutHistory = workoutHistory.map((workout) => {
      return workout.exercises.map((exercise) => {
        return {
          exercise: {
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
          },
          Date: workout.createdAt.toISOString(),
        };
      });
    });
    console.log(JSON.stringify(formattedWorkoutHistory, null, 2));

    const prompt = `
    As a professional fitness trainer, analyze this workout and provide specific advice:
    
    Recent History:
    
    ${JSON.stringify(formattedWorkoutHistory, null, 2)}
    Please provide:
    1. Progressive overload suggestions
    2. Form improvement tips
    3. Recovery recommendations
    4. Exercise variations
    5. Safety considerations
    `;
    console.log(prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an experienced fitness trainer providing specific, actionable workout advice.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = parseAIResponse(completion.choices[0].message.content);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
