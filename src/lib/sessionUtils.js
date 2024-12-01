import User from '@/models/User';
import Session from '@/models/Session';
import { logger } from './logger';

// Session expiration constants
const SESSION_EXPIRY_WARNING = 5 * 60 * 1000; // 5 minutes in ms
const SESSION_HARD_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

/**
 * Check if a session is approaching expiration
 */
export function isSessionExpiringSoon(session) {
  if (!session?.lastAccessed) return false;
  const expiryTime = new Date(session.lastAccessed).getTime() + SESSION_HARD_EXPIRY;
  const warningTime = expiryTime - SESSION_EXPIRY_WARNING;
  return Date.now() >= warningTime;
}

/**
 * Gets the latest active session for a user with detailed logging
 */
export async function getLatestSession(userId) {
  try {
    logger.info(`Fetching latest session for user: ${userId}`);
    
    const session = await Session.findOne({ 
      userId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    if (!session) {
      logger.warn(`No active session found for user: ${userId}`);
      return null;
    }

    // Check session expiration
    if (isSessionExpiringSoon(session)) {
      logger.warn(`Session ${session._id} for user ${userId} is approaching expiration`);
    }

    logger.info(`Found active session ${session._id} for user ${userId}, created at ${session.createdAt}`);
    return session;
  } catch (error) {
    logger.error(`Failed to get latest session: ${error.message}`, {
      userId,
      error: error.stack
    });
    return null;
  }
}

/**
 * Validates a token against current user and session state with enhanced logging
 */
export async function validateToken(token, sessionId) {
  const validationStart = Date.now();
  try {
    logger.info(`Starting token validation`, {
      tokenId: token?.id,
      sessionId,
      timestamp: new Date().toISOString()
    });

    if (!token?.id) {
      logger.warn('Token validation failed: No user ID in token');
      return false;
    }

    const user = await User.findById(token.id);
    if (!user) {
      logger.warn(`Token validation failed: User not found`, {
        userId: token.id,
        tokenEmail: token.email
      });
      return false;
    }

    // If no sessionId provided, try to get the latest active session
    let session;
    if (!sessionId) {
      logger.info(`No sessionId provided, attempting to find latest session for user: ${user._id}`);
      session = await getLatestSession(user._id.toString());
      if (!session) {
        return false;
      }
    } else {
      session = await Session.findById(sessionId);
      if (!session) {
        logger.warn(`Session not found`, {
          sessionId,
          userId: user._id
        });
        return false;
      }
    }

    // Enhanced session validation logging
    logger.info(`Session validation details`, {
      sessionId: session._id,
      userId: user._id,
      isActive: session.isActive,
      lastAccessed: session.lastAccessed,
      createdAt: session.createdAt,
      deviceInfo: session.deviceInfo
    });

    // Check if token version matches user's current version
    if (token.tokenVersion !== undefined && token.tokenVersion !== user.tokenVersion) {
      logger.info(`Token version mismatch`, {
        userVersion: user.tokenVersion,
        tokenVersion: token.tokenVersion,
        userId: user._id
      });
      return false;
    }

    // Check if session is active and not expired
    if (!session.isActive) {
      logger.info(`Session is inactive`, {
        sessionId: session._id,
        deactivatedAt: session.deactivatedAt
      });
      return false;
    }

    // Update last accessed time
    await Session.findByIdAndUpdate(session._id, {
      lastAccessed: new Date()
    });

    const validationTime = Date.now() - validationStart;
    logger.info(`Token validation successful`, {
      sessionId: session._id,
      userId: user._id,
      validationTimeMs: validationTime
    });

    return true;
  } catch (error) {
    logger.error(`Token validation error`, {
      error: error.message,
      stack: error.stack,
      tokenId: token?.id,
      sessionId,
      validationTimeMs: Date.now() - validationStart
    });
    return false;
  }
}

/**
 * Invalidates all sessions for a user
 */
export async function invalidateAllSessions(userId) {
  try {
    const [user] = await Promise.all([
      // Increment user's token version
      User.findByIdAndUpdate(userId, 
        { $inc: { tokenVersion: 1 } },
        { new: true }
      ),
      // Mark all sessions as inactive
      Session.updateMany(
        { userId, isActive: true },
        { 
          isActive: false,
          deactivatedAt: new Date(),
          tokenTimestamp: new Date()
        }
      )
    ]);

    logger.info(`All sessions invalidated for user: ${userId}, New token version: ${user.tokenVersion}`);
    return true;
  } catch (error) {
    logger.error(`Failed to invalidate all sessions: ${error.message}`);
    return false;
  }
}

/**
 * Invalidates a specific session
 */
export async function invalidateSession(sessionId, userId) {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId },
      { 
        isActive: false,
        deactivatedAt: new Date(),
        tokenTimestamp: new Date()
      },
      { new: true }
    );

    if (!session) {
      logger.warn(`Session not found or unauthorized: ${sessionId}`);
      return false;
    }

    logger.info(`Session invalidated: ${sessionId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to invalidate session: ${error.message}`);
    return false;
  }
}

/**
 * Creates a new session with proper token timestamp
 */
export async function createSession(userId, deviceInfo, ipAddress) {
  try {
    const session = await Session.create({
      userId,
      deviceInfo,
      ipAddress,
      tokenTimestamp: new Date(),
      isActive: true
    });

    logger.info(`New session created: ${session._id} for user: ${userId}`);
    return session;
  } catch (error) {
    logger.error(`Failed to create session: ${error.message}`);
    return null;
  }
}
