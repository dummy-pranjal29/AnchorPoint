import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "Username or email already in use");
  }

  const user = await User.create({
    userName,
    email,
    password,
    isEmailVerified: false,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    sunject: "Email Verification - AnchorPoint",
    mailgenContent: emailVerificationMailgenContent(
      user.userName,
      `${req.protocol}://${req.get(
        "host",
      )}/api/auth/verify-email?${unHashedToken}`,
    ),
  });

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent to your email",
      ),
    );
});

export { registerUser };
