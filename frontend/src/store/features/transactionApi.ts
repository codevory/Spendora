import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type {
  GetTransactionsResponse,
  RecentTransactionsType,
} from "../../types/recentTransactions.ts";
import type {
  CategoryPropsType,
  IncomeTransactionTypes,
  ResponseuserDataType,
  expenseTransactionParamsType,
  expenseTranscationTypes,
} from "../../types/transactionType.ts";

export const Backend_Url = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
  : "http://localhost:2122";

type CategoryResponse = {
  categories: CategoryPropsType[];
};

type IncomeResponse = {
  income: IncomeTransactionTypes[];
};

type CategoryMutationResponse = {
  category: CategoryPropsType;
};

export type loginDataType = {
  email:string 
  password:string
}
const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl:`${Backend_Url}/api`,
    credentials:"include",
    timeout:10000
  }),
  { 
    maxRetries:2
  }
)

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: staggeredBaseQuery,

  refetchOnFocus : true,
  tagTypes: ["RecentTransactions", "Expenses", "Income", "Categories"],
  endpoints: (builder) => ({
    getRecentTransactions: builder.query<GetTransactionsResponse, RecentTransactionsType>({
      query: ({ page, size, skip }) => ({
        url: "/transaction/transactions",
        method: "GET",
        params: { page, size, skip },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "RecentTransactions" as const, id: "LIST" },
              ...result.transactions.map((transaction) => ({
                type: "RecentTransactions" as const,
                id: transaction.transactionId,
              })),
            ]
          : [{ type: "RecentTransactions" as const, id: "LIST" }],
    }),
    getExpenseTransactions: builder.query<{ expenses: expenseTranscationTypes[] }, void>({
      query: () => ({
        url: "/transaction/expenses",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Expenses" as const, id: "LIST" },
              ...result.expenses.map((expense) => ({
                type: "Expenses" as const,
                id: expense.transactionId,
              })),
            ]
          : [{ type: "Expenses" as const, id: "LIST" }],
    }),
    getIncomeTransactions: builder.query<IncomeResponse, void>({
      query: () => ({
        url: "/transaction/incomes",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Income" as const, id: "LIST" },
              ...result.income.map((income) => ({
                type: "Income" as const,
                id: income.transactionId,
              })),
            ]
          : [{ type: "Income" as const, id: "LIST" }],
    }),
    getCategories: builder.query<CategoryResponse, void>({
      query: () => ({
        url: "/data/categories",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Categories" as const, id: "LIST" },
              ...result.categories.map((category) => ({
                type: "Categories" as const,
                id: category.id,
              })),
            ]
          : [{ type: "Categories" as const, id: "LIST" }],
    }),
   addExpenseTxn: builder.mutation<{transactionData:expenseTranscationTypes}, { transactionData: expenseTranscationTypes }>({
      query: ({ transactionData }) => ({
        url: "/transaction/addExpense",
        method: "POST",
        body: { transactionData },
      }),

      invalidatesTags: [
        { type : "Expenses", id:"LIST"},
        { type : "RecentTransactions", id: "LIST"}
      ],
      async onQueryStarted({ transactionData }, { queryFulfilled, dispatch }) {
        const optimisticExpense = {
          ...transactionData,
          amount: Number(transactionData.amount),
          createdAt: new Date().toISOString(), 
        };

        const patchRecent = dispatch(
          transactionApi.util.updateQueryData(
            "getRecentTransactions",
            { page: 1, size: 7, skip: 0 },
            (draftList) => {
              if (draftList && Array.isArray(draftList.transactions)) {
                draftList.transactions.unshift(optimisticExpense);
                draftList.size = Number(draftList.size) + 1;
              }
            }
          )
        );

        const patchExpenseTab = dispatch(
          transactionApi.util.updateQueryData(
            "getExpenseTransactions",
            undefined,
            (draftList) => {
              if (draftList && Array.isArray(draftList.expenses)) {
                draftList.expenses.unshift(transactionData);
              }
            }
          )
        );

        const patchFilteredExpense = dispatch(
          transactionApi.util.updateQueryData("getFilteredExpenseTransactions",{page:1,size:7,skip:0,query:undefined,from:undefined,to:undefined},(draftList) => {
            if(draftList && Array.isArray(draftList.expenses)){
              draftList.expenses.unshift(optimisticExpense)
            }
          })
        )

        try {
          await queryFulfilled;
        } catch {
          patchRecent.undo();
          patchExpenseTab.undo();
          patchFilteredExpense.undo()
          console.error("Mutation failed, rolling back optimistic UI updates.");
        }
      }
    }),

    addIncomeTxn: builder.mutation<{incomeData: IncomeTransactionTypes}, { incomeData: IncomeTransactionTypes }>({
      query: ({ incomeData }) => ({
        url: "/transaction/addIncome",
        method: "POST",
        body: { incomeData },
      }),
      invalidatesTags:[
        { type:"RecentTransactions", id: "LIST"},
        { type: "Income", id: "LIST" }
      ],
      async onQueryStarted({ incomeData }, { queryFulfilled, dispatch }) {
        const optimisticIncome = {
          ...incomeData,
          amount: Number(incomeData.amount),
          createdAt: new Date().toISOString(),
        };

        const patchRecent = dispatch(
          transactionApi.util.updateQueryData(
            "getRecentTransactions",
            { page: 1, size: 7, skip: 0 },
            (draftList) => {
              if (draftList && Array.isArray(draftList.transactions)) {
                draftList.transactions.unshift(optimisticIncome);
              }
            }
          )
        );

        const patchIncomeTab = dispatch(
          transactionApi.util.updateQueryData(
            "getIncomeTransactions",
            undefined,
            (draftList) => {
              if (draftList && Array.isArray(draftList.income)) {
                draftList.income.unshift(incomeData);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchRecent.undo();
          patchIncomeTab.undo();
          console.error("Mutation failed, rolling back optimistic UI updates.");
        }
      }
    }),
    addCategory: builder.mutation<CategoryMutationResponse, { name: string }>({
      query: ({ name }) => ({
        url: "/data/addNewCategory",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),
    renameCategory: builder.mutation<CategoryMutationResponse, { category: CategoryPropsType }>({
      query: ({ category }) => ({
        url: "/data/renameCategory",
        method: "POST",
        body: { category },
      }),
      invalidatesTags: (_result, error, { category }) =>
        error
          ? []
          : [
              { type: "Categories" as const, id: "LIST" },
              { type: "Categories" as const, id: category.id },
              {type: "RecentTransactions" as const, id: "LIST"},
              { type: "Expenses" as const, id: "LIST"}
            ],
    }),
    deleteCategory: builder.mutation<void, { category: CategoryPropsType }>({
      query: ({ category }) => ({
        url: "/data/deleteCategory",
        method: "DELETE",
        body: { category },
      }),
      invalidatesTags: [
        { type: "Categories", id: "LIST" },
        { type: "Expenses", id: "LIST"},
        { type: "RecentTransactions", id: "LIST"}
      ],
    }),

    logoutUser: builder.mutation<{message:string,code:number},void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET"
      })
    }),
    loginUser: builder.mutation<ResponseuserDataType,loginDataType>({
      query: ({email,password}) => ({
       url: "/auth/login",
       method: "POST",
       body: {email,password}
      })
    }),
    getUserProfile: builder.query<ResponseuserDataType,void>({
      query: () => ({
        url : "/auth/me",
        method: "GET"
      })
    }),

    getFilteredExpenseTransactions : builder.query<{expenses: expenseTranscationTypes[]},expenseTransactionParamsType>({
      query: ({query,page,size,skip,from,to}) => ({
        url: "transaction/expenses/filtered",
        method: "GET",
        params: {query,page,size,skip,from,to}
      }),
      providesTags: (result) => 
        result 
      ? [
        { type: "RecentTransactions" as const, id: "LIST"},
        ...result.expenses.map((transaction) => ({
          type: "RecentTransactions" as const, id: transaction.transactionId
        })),
      ] : 
      [{type : "RecentTransactions" as const, id: "LIST"}]
    })
  })
});

export const {
  useGetRecentTransactionsQuery,
  useGetIncomeTransactionsQuery,
  useGetCategoriesQuery,
  useAddExpenseTxnMutation,
  useAddIncomeTxnMutation,
  useAddCategoryMutation,
  useRenameCategoryMutation,
  useDeleteCategoryMutation,
  useLogoutUserMutation,
  useGetFilteredExpenseTransactionsQuery,
  useGetExpenseTransactionsQuery
} = transactionApi;