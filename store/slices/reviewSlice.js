import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, addDoc, Timestamp, doc, updateDoc, arrayUnion, getDoc, } from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
    reviewArray: [],
    userReview: null,

    creating: false,
    createError: null,

    loading: false,
    error: null,
}

export const fetchReviewsByBookId = createAsyncThunk(
    'reviews/fetchByBookId',
    async (bookId, { rejectWithValue }) => {
        try {
            // Validate input
            if (!bookId || typeof bookId !== 'string') {
                return rejectWithValue('Invalid bookId provided');
            }

            // Create a query to get reviews where bookId field matches
            const reviewsRef = collection(db, 'Reviews');
            const q = query(reviewsRef, where('bookId', '==', bookId));

            // Execute the query
            const querySnapshot = await getDocs(q);

            // Transform Firestore documents to array of objects
            const reviews = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.reviewDate?.toDate) {
                    const d = data.reviewDate.toDate();
                    data.reviewDate = `${d.getDate()}/${d.getMonth() + 1
                        }/${d.getFullYear()}`;
                }
                reviews.push({
                    id: doc.id, // Firestore document ID
                    ...data,
                });
            });

            // Sort reviews by date (newest first) if you have a timestamp field
            reviews.sort((a, b) => {
                const dateA = a.reviewDate;
                const dateB = b.reviewDate;
                return new Date(dateB) - new Date(dateA);
            });

            return {
                bookId,
                reviews,
            };

        } catch (error) {
            console.error('Error fetching reviews:', error);
            return rejectWithValue({
                message: error.message || 'Failed to fetch reviews',
                code: error.code,
            });
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async ({ reviewText, reviewer, reviewAvatar, bookId, type }, { rejectWithValue, getState, dispatch }) => {
        try {
            // Create current date
            const currentDate = new Date();
            const timestamp = Timestamp.fromDate(currentDate);

            const state = getState();
            const reviewerId = state.account.userId;

            // Create review object
            const reviewToCreate = {
                reviewText,
                reviewer,
                reviewerId,
                reviewAvatar: reviewAvatar || null,
                bookId,
                type,
                reviewDate: timestamp,
            };

            // Add to Firestore
            const docRef = await addDoc(collection(db, 'Reviews'), reviewToCreate);
            console.log("New review created successfully");

            const userRef = doc(db, 'Users', reviewerId);
            await updateDoc(userRef, {
                reviewIdList: arrayUnion(docRef.id),
            });

            dispatch(fetchReviewsByBookId(bookId))
            dispatch(fetchUserReviewForBook(bookId))
        } catch (error) {
            console.error('Error creating review:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ reviewText, type, reviewId, bookId }, { rejectWithValue, dispatch }) => {
        try {
            // Create current date
            const currentDate = new Date();
            const timestamp = Timestamp.fromDate(currentDate);

            if (reviewText == '') {
                reviewText = null;
            }

            // Create review object
            const reviewToUpdate = {
                reviewText,
                type,
                reviewDate: timestamp,
            };

            const reviewRef = doc(db, 'Reviews', reviewId);
            // Update the document
            await updateDoc(reviewRef, {
                ...reviewToUpdate,
            });
            console.log("Review updated successfully");

            dispatch(fetchReviewsByBookId(bookId))
            dispatch(fetchUserReviewForBook(bookId))
        } catch (error) {
            console.error('Error creating review:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserReviewForBook = createAsyncThunk(
    'reviews/fetchUserReviewForBook',
    async (bookId, { rejectWithValue, getState }) => {
        try {
            console.log(bookId)
            const state = getState();
            const userId = state.account.userId;
            console.log(userId)
            // Create query: get reviews where bookId matches AND userId matches
            const reviewsRef = collection(db, 'Reviews');
            const q = query(
                reviewsRef,
                where('bookId', '==', bookId),
                where('reviewerId', '==', userId)
            );

            const querySnapshot = await getDocs(q);

            // Check if any matching reviews were found
            if (querySnapshot.empty) {
                // Return null to indicate no review exists
                return null;
            }

            // Get the first matching review (user should only have one review per book)
            const docSnap = querySnapshot.docs[0];
            const reviewData = docSnap.data();

            if (reviewData.reviewDate?.toDate) {
                const d = reviewData.reviewDate.toDate();
                reviewData.reviewDate = `${d.getDate()}/${d.getMonth() + 1
                    }/${d.getFullYear()}`;
            }
            // Format the review data
            const review = {
                id: docSnap.id,
                ...reviewData,
            };

            return review;

        } catch (error) {
            console.error('Error fetching user review:', error);

            // Handle specific Firestore errors
            if (error.code === 'failed-precondition') {
                return rejectWithValue('Too many conditions in query. Please contact support.');
            }

            return rejectWithValue({
                message: error.message || 'Failed to fetch user review',
                code: error.code,
            });
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch reviews pending
            .addCase(fetchReviewsByBookId.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            // Fetch reviews fulfilled
            .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const { bookId, reviews } = action.payload;

                // Store reviews by bookId
                state.reviewArray = reviews
            })
            // Fetch reviews rejected
            .addCase(fetchReviewsByBookId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(createReview.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.creating = false;
                state.createError = null;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload || action.error.message;
            })
            .addCase(updateReview.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.creating = false;
                state.createError = null;
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload || action.error.message;
            })
            .addCase(fetchUserReviewForBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReviewForBook.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.userReview = action.payload;
            })
            .addCase(fetchUserReviewForBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    }
});
export const { } = reviewSlice.actions;
export default reviewSlice.reducer;