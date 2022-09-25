const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select("-__v -password")
            .populate("savedBooks");
  
          return userData;
        }
  
        throw new AuthenticationError("Not Logged In");
      },
      users: async () => {
        return User.find().select("-__v -password").populate("savedBooks");
      },
    },
  
    Mutation: {
      addUser: async (parent, args) => {
        const user = await User.create(args);
        console.log(user);
        const token = signToken(user);
  
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError("Incorrect credentials");
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }
  
        const token = signToken(user);
        return { token, user };
      },
      saveBook: async (parent, { input }, context) => {
        if (context.user) {
          let updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: input } },
            { new: true }
          ).populate("savedBooks");
  
          return updatedUser;
        }
  
        throw new AuthenticationError("Not Logged In!");
      },
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedBooks = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          ).populate("savedBooks");
  
          return updatedBooks;
        }
  
        throw new AuthenticationError("Not Logged In!");
      },
    },
  };
  