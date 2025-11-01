import express from "express";
import { environment } from "../models/environment.js";

const router = express.Router();

/**
 * POST /env/reset
 * Reset the environment to initial state
 */
router.post("/reset", (req, res) => {
  try {
    const state = environment.reset();
    res.json({
      success: true,
      state,
      message: "Environment reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/state
 * Get current environment state (observation)
 */
router.get("/state", (req, res) => {
  try {
    const state = environment.getState();
    res.json({
      success: true,
      state,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /env/step
 * Execute an action and get next state + reward
 * Body: { action: { type: string, payload: object } }
 */
router.post("/step", (req, res) => {
  try {
    const { action } = req.body;

    if (!action || !action.type) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid action format. Expected: { action: { type: string, payload: object } }",
      });
    }

    const result = environment.step(action);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/actions
 * Get list of available actions
 */
router.get("/actions", (req, res) => {
  try {
    const actions = environment.getAvailableActions();
    res.json({
      success: true,
      ...actions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /env/stats
 * Get episode statistics
 */
router.get("/stats", (req, res) => {
  try {
    const state = environment.getState();
    res.json({
      success: true,
      stats: state.episodeStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
