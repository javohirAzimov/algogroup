import { Router } from 'express'
import {
  getStore, getMyRedemptions, redeemReward,
  adminGetAllRewards, adminCreateReward, adminUpdateReward, adminDeleteReward,
  adminGetRedemptions, adminUpdateRedemption,
  adminGrantPoints, adminAwardTournamentPoints,
  getPointsLeaderboard,
} from '../controllers/rewardsController.js'
import { verifyToken, requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(verifyToken)

// User routes
router.get('/',                   getStore)
router.get('/my-redemptions',     getMyRedemptions)
router.get('/leaderboard',        getPointsLeaderboard)
router.post('/:id/redeem',        redeemReward)

// Admin routes
router.get('/admin/items',                              requireAdmin, adminGetAllRewards)
router.post('/admin/items',                             requireAdmin, adminCreateReward)
router.put('/admin/items/:id',                          requireAdmin, adminUpdateReward)
router.delete('/admin/items/:id',                       requireAdmin, adminDeleteReward)
router.get('/admin/redemptions',                        requireAdmin, adminGetRedemptions)
router.patch('/admin/redemptions/:id',                  requireAdmin, adminUpdateRedemption)
router.post('/admin/grant-points',                      requireAdmin, adminGrantPoints)
router.post('/admin/tournament-points/:tournamentId',   requireAdmin, adminAwardTournamentPoints)

export default router
