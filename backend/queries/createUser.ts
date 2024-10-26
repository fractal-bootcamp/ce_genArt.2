import { getAuth } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import prisma from "../client";

// somethnig here tp get the user obec from clerk
// e.g. user = getAuth(auth)

export async function getOrCreateUser(
  clerkId: string,
  email: string,
  name: string
) {
  try {
    // check if user exists
    // let here allows us to Reassign it with a new user if none was found
    let user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
    console.log("user is", user);

    // if user doesn't exist - we need to create them!
    if (!user) {
      console.log(clerkId, email, name);
      user = await prisma.user.create({
        data: {
          clerkId: clerkId,
          email: email,
          name: name,
        },
      });
    }
    console.log("it's me ", user);

    return user;
  } catch (error) {
    console.log(error);
  }
}

// export async function createUser(clerkId, email, name) {
//     try {
//       // Check if user already exists
//       let user = await prisma.user.findUnique({
//         where: {
//           email: email
//         }
//       });

//       // If user doesn't exist, create them
//       if (!user) {
//         user = await prisma.user.create({
//           data: {
//             id: clerkId,
//             email: email,
//             name: name,
//             // Create an initial artwork (optional - remove if not needed)
//             Artwork: {
//               create: [{
//                 title: "Welcome!",
//                 published: false,
//                 configuration: {}
//               }]
//             }
//           },
//           // Include the created artwork in the response
//           include: {
//             Artwork: true
//           }
//         });
//       }

//       return user;

//     } catch (error) {
//       console.error("Error creating user:", error);
//       throw error;
//     }
//   }
