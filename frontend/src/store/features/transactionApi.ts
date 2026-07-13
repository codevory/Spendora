import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetTransactionsResponse,
  RecentTransactionsType,
} from "../../types/recentTransactions.ts";
import type {
  CategoryPropsType,
  IncomeTransactionTypes,
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

type ExpenseMutationResponse = {
  transactionData: expenseTranscationTypes;
};

type IncomeMutationResponse = {
  incomeData: IncomeTransactionTypes;
};

type CategoryMutationResponse = {
  category: CategoryPropsType;
};



export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${Backend_Url}/api`,
    credentials: "include",
  }),

  refetchOnFocus : true,
  tagTypes: ["Transactions", "Expenses", "Income", "Categories"],
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
              { type: "Transactions" as const, id: "LIST" },
              ...result.transactions.map((transaction) => ({
                type: "Transactions" as const,
                id: transaction.transactionId,
              })),
            ]
          : [{ type: "Transactions" as const, id: "LIST" }],
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
    addExpenseTxn: builder.mutation<ExpenseMutationResponse, { transactionData: expenseTranscationTypes }>({
      query: ({ transactionData }) => ({
        url: "/transaction/addExpense",
        method: "POST",
        body: { transactionData },
      }),
      invalidatesTags: [
        { type: "Transactions", id: "LIST" },
        { type: "Expenses", id: "LIST" }
      ],
    }),
    addIncomeTxn: builder.mutation<IncomeMutationResponse, { incomeData: IncomeTransactionTypes }>({
      query: ({ incomeData }) => ({
        url: "/transaction/addIncome",
        method: "POST",
        body: { incomeData },
      }),
      invalidatesTags: [
        { type: "Transactions", id: "LIST" },
        { type: "Income", id: "LIST" },
      ],
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
              {type: "Transactions" as const, id: "LIST"},
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
        { type: "Transactions", id: "LIST"}
      ],
    }),

    logoutUser: builder.mutation<{message:string,code:number},void>({
      query: () => ({
        url: "/auth/logout",
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
        { type: "Transactions" as const, id: "LIST"},
        ...result.expenses.map((transaction) => ({
          type: "Transactions" as const, id: transaction.transactionId
        })),
      ] : 
      [{type : "Transactions" as const, id: "LIST"}]
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