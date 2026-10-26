import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { type IUser } from '../models/users.js'

// Extend Express's Request type so req.user is recognized everywhere
declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

interface JwtPayload {
  id: string
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    // Check if jwt in cookies is present else on the header
    const token =
      req.cookies?.jwt ??
      (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined)

    // Check token
    if (!token) {
      res.status(401).json({ status: 'fail', message: 'Not logged in.' })
      return
    }

    // Verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload

    // Check current user
    const currentUser = await User.findById(payload.id)
    if (!currentUser) {
      res
        .status(401)
        .json({ status: 'fail', message: 'User no longer exists.' })
      return
    }

    // Set user on the request
    req.user = currentUser
    next()
  } catch (err) {
    res
      .status(401)
      .json({ status: 'fail', message: 'Invalid or expired token.' })
  }
}

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // If user is not admin
  if (req.user?.userType !== 'admin') {
    res.status(403).json({ status: 'fail', message: 'Admins only.' })
    return
  }
  next()
}
