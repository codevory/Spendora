import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CategoryPropsType,
  expenseTranscationTypes,
  IncomeTransactionTypes,
} from "../../types/transactionType";

 const isProduction = import.meta.env.PROD
 export const Backend_Url = isProduction ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/,'') : ''

interface TransactionState {
  categories: CategoryPropsType[];
  expenseTransactions: expenseTranscationTypes[];
  incomeTransactions: IncomeTransactionTypes[];
  status: "idle" | "pending" | "failed" | "success";
  error: { message: string; code: number } | null;
}

//async thunk 
export const fetchInitialData = createAsyncThunk(
  "transaction/fetchInitialData",
  async (_, { rejectWithValue }) => {
    try {
      const [transRes, incomeRes, catRes] = await Promise.allSettled([
        fetch(`${Backend_Url}/api/transaction/expenses`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${Backend_Url}/api/transaction/income`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${Backend_Url}/api/data/categories`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      const expenses =
        transRes.status === "fulfilled" && transRes.value.ok
          ? (await transRes.value.json()).expenses ?? []
          : [];
      const income =
        incomeRes.status === "fulfilled" && incomeRes.value.ok
          ? (await incomeRes.value.json()).data ?? []
          : [];
      const categories =
        catRes.status === "fulfilled" && catRes.value.ok
          ? (await catRes.value.json()).categories ?? []
          : [];

      if (transRes.status === "rejected" || incomeRes.status === "rejected" || catRes.status === "rejected") {
        console.error("One or more initial data requests failed", {
          expensesError: transRes.status === "rejected" ? transRes.reason : null,
          incomeError: incomeRes.status === "rejected" ? incomeRes.reason : null,
          categoriesError: catRes.status === "rejected" ? catRes.reason : null,
        });
      }

      return { expenses, categories, income };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to fetch data ",
        code: 500,
      });
    }
  }
)

export const addCategoryThunk = createAsyncThunk(
  "transaction/addCategory",
  async (name:string,{ rejectWithValue }) => {
    try {
      const result = await fetch(`${Backend_Url}/api/data/addNewCategory`,{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name})
      });

      const res  = await result.json()
      if(!result.ok) throw new Error( res.error || "Failed to add Category")

      return  res.category || { name }
    } catch (error:any) {
      return rejectWithValue(error.message)
    }
  }

)

export const renameCategory = createAsyncThunk(
  "transaction/renameCategory",
  async (category:CategoryPropsType,{ rejectWithValue }) => {
   try {
    const result = await fetch(`${Backend_Url}/api/data/renameCategory`,{
      method:"POST",
      credentials:'include',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({category})
    })

    const res = await result.json()
    if(!result.ok) throw new Error(res.error || "failed to rename category")
    return res.categories
   } catch (error:any) {
    return rejectWithValue(error.message)
   }
  }
)

//handle deleteCategory
export const deleteCategoryThunk = createAsyncThunk(
  "transaction/delete",
  async (category:CategoryPropsType,{ rejectWithValue }) => {
    try {
      const result = await fetch(`${Backend_Url}/api/data/deleteCategory`,{
        method:"DELETE",
        credentials:'include',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({category})
      })

      if(!result.ok){
        throw new Error(result.status == 400 ? " Bad request or invalid category" : "Failed to delete from Server")
      }
      return category
    } catch (err:any) {
      return rejectWithValue(err.message)
    }
  }
)

//handle addExpense
export const addExpense = createAsyncThunk(
  "transaction/addExpense",
  async (transactionData:expenseTranscationTypes, {rejectWithValue}) => {
    try {
      const result = await fetch(`${Backend_Url}/api/transaction/addExpense`,{
        method:"POST",
        credentials:'include',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({transactionData})
      })

      const res = await result.json()
      if(!result.ok) throw new Error(res.error || "Failed to add Expense")

      return (res.transactionData || {transactionData})
    } catch (error:any) {
      return rejectWithValue(error.message || "Failed to add Expense")
    }
  }
)

//handle addIncome
export const addIncomeThunk = createAsyncThunk(
  "transaction/addIncome",
  async (incomeData:IncomeTransactionTypes,{ rejectWithValue }) => {
    try {
      const result = await fetch(`${Backend_Url}/api/transaction/addIncome`, {
        method:"POST",
        credentials:'include',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({incomeData})
      })

      const res = await result.json()
      if(!result.ok) throw new Error(res.error ?? "Failed to add Income, try again")
      console.log("income transaction added successfully🎉")
      return res.incomeData
    } catch (err:any) {
      return rejectWithValue(err.message ?? "server error bad request made")
    }
  }
)

const initialState: TransactionState = {
  categories: [],
  expenseTransactions: [],
  incomeTransactions:[],
  status: "idle",
  error: null,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
  builder
   //handling Fetching initial Data
  .addCase(fetchInitialData.pending, (state) => {
    state.status = "pending"
  })
  .addCase(fetchInitialData.fulfilled, (state,action) => {
    state.status = "success"
    state.expenseTransactions = action.payload.expenses
    state.categories = action.payload.categories
    state.incomeTransactions = action.payload.income
  })
  .addCase(fetchInitialData.rejected, (state,action:any) => {
    state.status = "failed"
    state.error = action.payload
  })

  //handling addCategory
  .addCase(addCategoryThunk.pending, (state) => {
    state.status = "pending"
  })
  .addCase(addCategoryThunk.fulfilled, (state,action:PayloadAction <CategoryPropsType>) => {
   state.status = "success"
   console.log(action.payload)
   state.categories.push(action.payload)
  })
  .addCase(addCategoryThunk.rejected, (state, action: any) => {
    state.status = "failed"
    state.error = {message:action.payload as string,code:400}
  })

  //handle renameCategory
  .addCase(renameCategory.pending,(state) => {
    state.status = "pending"
  })
  .addCase(renameCategory.fulfilled,(state,action:PayloadAction<CategoryPropsType[]>) => {
  state.status = "success"
  state.categories = action.payload
  })
  .addCase(renameCategory.rejected,(state,action:any) => {
    state.status = "failed"
    state.error = action.payload
  })
  
  //handle deleteCategory
  .addCase(deleteCategoryThunk.pending, (state) => {
    state.status = "pending"
  })
  .addCase(deleteCategoryThunk.fulfilled,(state,action:PayloadAction<CategoryPropsType>) => {
   state.status = "success"
   state.categories = state.categories.filter((cat) => cat.id !== action.payload.id)
  })
  .addCase(deleteCategoryThunk.rejected, (state,action:any) => {
    state.status = "failed"
    state.error = action.payload
  })

  //handle addExpense
  .addCase(addExpense.pending, (state) => {
    state.status = "pending"
  })
  .addCase(addExpense.fulfilled, (state,action:PayloadAction<expenseTranscationTypes>) => {
   state.status = "success"
   state.expenseTransactions.push(action.payload)
  })
  .addCase(addExpense.rejected, (state,action:any) => {
   state.status = "failed"
   state.error = action.payload
  })

  //handle addIncome
  .addCase(addIncomeThunk.pending, (state) => {
   state.status = "pending"
  })
  .addCase(addIncomeThunk.fulfilled, (state,action:PayloadAction<IncomeTransactionTypes>) => {
   state.status = "success"
   state.incomeTransactions.push(action.payload)
  })
  .addCase(addIncomeThunk.rejected,(state,action:any) => {
    state.status = "failed"
    state.error = action.payload
  })
  }

});

export default transactionSlice.reducer;
export const {} = transactionSlice.actions;
