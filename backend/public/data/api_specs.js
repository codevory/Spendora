import { is_Production } from "../../db/getBDConnection.js";

export const apiSpecs = {
  openapi: "3.0.3",
  info: {
    title: "Spendora API Docs",
    version: "1.0.0",
    description:
      "API documentation for managing user transactions (expenses & income) and expense categories.",
  },
  paths: {
    "/api/v1/transactions/financial-summary": {
      get: {
        summary:
          "Get financial summary overview and 12-month rolling breakdown",
        operationId: "getFinancialSummary",
        tags: ["Transactions"],
        responses: {
          200: {
            description: "Financial summary retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    financialSummary: {
                      $ref: "#/components/schemas/FinancialSummaryOverview",
                    },
                    monthlyFinanceReport: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/MonthlyFinanceItem",
                      },
                    },
                  },
                },
                example: {
                  financialSummary: {
                    totalIncome: "1099917.00",
                    totalExpense: "71225.00",
                    netBalance: "1028692.00",
                  },
                  monthlyFinanceReport: [
                    {
                      month_name: "Aug 26",
                      totalIncome: "144044.00",
                      totalExpense: "35979.00",
                      netBalance: "108065.00",
                    },
                    {
                      month_name: "Jul 26",
                      totalIncome: "955873.00",
                      totalExpense: "35246.00",
                      netBalance: "920627.00",
                    },
                  ],
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/transactions/expenses": {
      post: {
        summary: "Add a new expense transaction",
        operationId: "addExpense",
        tags: ["Expenses"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["transactionData"],
                properties: {
                  transactionData: {
                    type: "object",
                    required: ["amount", "entity", "categoryId"],
                    properties: {
                      amount: {
                        type: "number",
                        exclusiveMinimum: 0,
                        example: 2573.0,
                      },
                      entity: {
                        type: "string",
                        example: "Wifi bills",
                      },
                      date: {
                        type: "string",
                        format: "date-time",
                        example: "2026-07-25T18:30:00.000Z",
                      },
                      categoryId: {
                        oneOf: [
                          {
                            type: "string",
                          },
                          {
                            type: "integer",
                          },
                        ],
                        example: 10,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Expense transaction created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    transactionData: {
                      $ref: "#/components/schemas/ExpenseItem",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequestError",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
      get: {
        summary: "Get filtered list of user expenses",
        operationId: "getExpense",
        tags: ["Expenses"],
        parameters: [
          {
            name: "query",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            description: "Search term for expense entity or category",
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
            },
          },
          {
            name: "skip",
            in: "query",
            required: false,
            schema: {
              type: "integer",
            },
          },
          {
            name: "from",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "to",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "sort",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
        ],
        responses: {
          200: {
            description: "List of expenses retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          nullable: true,
                          example: "domestic bills",
                        },
                        page: {
                          type: "integer",
                          example: 1,
                        },
                        skip: {
                          type: "integer",
                          example: 0,
                        },
                        from: {
                          type: "string",
                          format: "date-time",
                          example: "2026-04-26T18:30:00.000Z",
                        },
                        to: {
                          type: "string",
                          format: "date-time",
                          example: "2026-07-27T18:29:59.999Z",
                        },
                        size: {
                          $ref: "#/components/schemas/MetaSize",
                        },
                      },
                    },
                    expenses: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/ExpenseItem",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/transactions/incomes": {
      post: {
        summary: "Add a new income transaction",
        operationId: "addIncome",
        tags: ["Incomes"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["incomeData"],
                properties: {
                  incomeData: {
                    type: "object",
                    required: ["amount", "entity"],
                    properties: {
                      amount: {
                        type: "number",
                        exclusiveMinimum: 0,
                        example: 260122.0,
                      },
                      entity: {
                        type: "string",
                        example: "Agricultural Income",
                      },
                      date: {
                        type: "string",
                        format: "date-time",
                        example: "2026-07-25T18:30:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Income created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    incomeData: {
                      $ref: "#/components/schemas/IncomeItem",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequestError",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
      get: {
        summary: "Get paginated user income entries",
        operationId: "getIncome",
        tags: ["Incomes"],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
            },
          },
          {
            name: "skip",
            in: "query",
            required: false,
            schema: {
              type: "integer",
            },
          },
          {
            name: "from",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "to",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "sort",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
        ],
        responses: {
          200: {
            description: "List of incomes retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      $ref: "#/components/schemas/PaginationMeta",
                    },
                    incomes: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/IncomeItem",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/transactions": {
      get: {
        summary: "Get recent transactions combining income and expenses",
        operationId: "getRecentTransactions",
        tags: ["Transactions"],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
            },
          },
          {
            name: "skip",
            in: "query",
            required: false,
            schema: {
              type: "integer",
            },
          },
          {
            name: "from",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "to",
            in: "query",
            required: false,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "sort",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
        ],
        responses: {
          200: {
            description: "Combined transaction list retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      $ref: "#/components/schemas/PaginationMeta",
                    },
                    transactions: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/TransactionItem",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/transactions/delete/{transactions}": {
      delete: {
        summary: "Delete one or more transactions",
        operationId: "handleDeleteTransactions",
        tags: ["Transactions"],
        parameters: [
          {
            name: "transactions",
            in: "path",
            required: true,
            description:
              "Comma-separated UUIDs of expense or income transactions to delete",
            schema: {
              type: "string",
              pattern:
                "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}(,[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})*$",
              example:
                "bb75b754-5ab8-4872-8d2d-8e7359d8f722,5d44aef6-fd32-4e93-aee7-9db0e09cc5ab",
            },
          },
        ],
        responses: {
          204: {
            description: "Transactions deleted successfully",
          },
          400: {
            $ref: "#/components/responses/BadRequestError",
          },
          404: {
            description: "No matching transactions found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "No transactions found to delete",
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/categories": {
      get: {
        summary: "Get the authenticated user's categories",
        operationId: "getCategories",
        tags: ["Categories"],
        responses: {
          200: {
            description: "List of categories with transaction counts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    categories: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/CategoryWithCount",
                      },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        size: {
                          type: "integer",
                          example: 5,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
      post: {
        summary: "Create a new expense category",
        operationId: "addNewCategory",
        tags: ["Categories"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    example: "domestic bills",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Category created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    category: {
                      $ref: "#/components/schemas/CategoryBase",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequestError",
          },
          409: {
            description: "Category already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "category already exists!",
                },
              },
            },
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/categories/{id}": {
      patch: {
        summary: "Rename an existing category",
        operationId: "renameCategory",
        tags: ["Categories"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Numeric Category ID",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    example: "utilities",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Category renamed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    category: {
                      $ref: "#/components/schemas/CategoryBase",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequestError",
          },
          404: {
            description: "Category not found or unauthorized access",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "category not found or unauthorized access",
                },
              },
            },
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
      delete: {
        summary: "Delete an expense category",
        operationId: "deleteCategory",
        tags: ["Categories"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Numeric Category ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          204: {
            description: "Category deleted successfully",
          },
          400: {
            $ref: "#/components/responses/BadRequestError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        summary: "Register a new user account",
        operationId: "registerUser",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "fullName",
                  "username",
                  "email",
                  "password",
                  "currency",
                ],
                properties: {
                  fullName: {
                    type: "string",
                    example: "Shahijahan Pedhar",
                  },
                  username: {
                    type: "string",
                    example: "shahijahan",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "securePassword123",
                  },
                  currency: {
                    type: "string",
                    example: "INR",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User successfully registered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    fullName: {
                      type: "string",
                      example: "Shahijahan Pedhar",
                    },
                    email: {
                      type: "string",
                      example: "user@example.com",
                    },
                    username: {
                      type: "string",
                      example: "shahijahan",
                    },
                    currency: {
                      type: "string",
                      example: "INR",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Registration validation or conflict error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                examples: {
                  bothTaken: {
                    summary: "Both Username and Email taken",
                    value: {
                      error: "Username and Email are both already taken!",
                    },
                  },
                  emailTaken: {
                    summary: "Email already in use",
                    value: {
                      error: "email already in use!",
                    },
                  },
                  usernameTaken: {
                    summary: "Username already taken",
                    value: {
                      error: "username already taken",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "Internal server error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Authenticate user credentials and initiate session",
        operationId: "loginUser",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "securePassword123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "login successful",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "invalid email or password",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "Internal server error message",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      get: {
        summary: "Logout user and destroy active session",
        operationId: "logoutUser",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "logout succesfull",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            description: "Internal server error during session destruction",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "Failed to destroy session",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        summary: "Get the authenticated user's profile",
        operationId: "getCurrentUser",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    fullName: {
                      type: "string",
                      example: "Shahijahan Pedhar",
                    },
                    uid: {
                      type: "string",
                      format: "uuid",
                    },
                    email: {
                      type: "string",
                      format: "email",
                    },
                    username: {
                      type: "string",
                    },
                    currency: {
                      type: "string",
                      example: "INR",
                    },
                    inserted_at: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/status": {
      get: {
        summary: "Check API availability",
        operationId: "getServerHealth",
        tags: ["Status"],
        responses: {
          200: {
            description: "Server is available",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    response: {
                      type: "string",
                      example: "server alive",
                    },
                  },
                },
              },
            },
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/auth/sid": {
      get: {
        summary: "Retrieve active session ID",
        operationId: "getSessionId",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Session ID retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sid: {
                      type: "string",
                      example: "s%3A3J0f9A8d7C6b5A4e3D2c1",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/auth/csrf": {
      get: {
        summary: "Retrieve CSRF token for authenticated session",
        operationId: "getCsrfToken",
        tags: ["Auth"],
        responses: {
          200: {
            description: "CSRF token generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    csrf: {
                      type: "string",
                      example: "d9f8a7b6c5d4e3f2a1b0",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          500: {
            description: "Internal server error generating CSRF token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  error: "Could not generate CSRF token",
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Invalid input parameters",
          },
        },
      },
      MetaSize: {
        type: "object",
        properties: {
          requested: {
            type: "integer",
            example: 50,
          },
          received: {
            type: "integer",
            example: 10,
          },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            example: 1,
          },
          skip: {
            type: "integer",
            example: 0,
          },
          from: {
            type: "string",
            format: "date-time",
            example: "2026-04-26T18:30:00.000Z",
          },
          to: {
            type: "string",
            format: "date-time",
            example: "2026-07-27T18:29:59.999Z",
          },
          size: {
            $ref: "#/components/schemas/MetaSize",
          },
        },
      },
      TransactionItem: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 105,
          },
          amount: {
            type: "number",
            example: 2573.0,
          },
          type: {
            type: "string",
            enum: ["expense", "income"],
            example: "expense",
          },
          entity: {
            type: "string",
            example: "Wifi bills",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-25T18:30:00.000Z",
          },
          transactionId: {
            type: "string",
            example: "TXN_b2daf9b3-5e6f-4423-8e31-dc0a38a9deb6",
          },
          categoryId: {
            type: "integer",
            nullable: true,
            example: 10,
          },
          categoryName: {
            type: "string",
            nullable: true,
            example: "domestic bills",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      ExpenseItem: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 105,
          },
          amount: {
            type: "number",
            example: 2573.0,
          },
          entity: {
            type: "string",
            example: "Wifi bills",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-25T18:30:00.000Z",
          },
          transactionId: {
            type: "string",
            example: "TXN_b2daf9b3-5e6f-4423-8e31-dc0a38a9deb6",
          },
          categoryId: {
            type: "integer",
            example: 10,
          },
          categoryName: {
            type: "string",
            nullable: true,
            example: "domestic bills",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          type: {
            type: "string",
            example: "expense",
          },
        },
      },
      IncomeItem: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 42,
          },
          amount: {
            type: "number",
            example: 260122.0,
          },
          entity: {
            type: "string",
            example: "Agricultural Income",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-25T18:30:00.000Z",
          },
          transactionId: {
            type: "string",
            example: "TXN_0701249d-6d8a-4166-b54b-c6cf2afb9681",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      FinancialSummaryOverview: {
        type: "object",
        properties: {
          totalIncome: {
            type: "string",
            example: "1099917.00",
          },
          totalExpense: {
            type: "string",
            example: "71225.00",
          },
          netBalance: {
            type: "string",
            example: "1028692.00",
          },
        },
      },
      MonthlyFinanceItem: {
        type: "object",
        properties: {
          month_name: {
            type: "string",
            example: "Aug 26",
          },
          totalIncome: {
            type: "string",
            example: "144044.00",
          },
          totalExpense: {
            type: "string",
            example: "35979.00",
          },
          netBalance: {
            type: "string",
            example: "108065.00",
          },
        },
      },
      CategoryBase: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 10,
          },
          name: {
            type: "string",
            example: "domestic bills",
          },
        },
      },
      CategoryWithCount: {
        allOf: [
          {
            $ref: "#/components/schemas/CategoryBase",
          },
          {
            type: "object",
            properties: {
              transactionCount: {
                type: "integer",
                example: 12,
              },
            },
          },
        ],
      },
    },
    responses: {
      BadRequestError: {
        description:
          "Bad Request - Missing required parameters or invalid types",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
          },
        },
      },
      UnauthorizedError: {
        description: "Unauthorized - Valid session cookie or user ID missing",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              error: "Unauthorized access",
            },
          },
        },
      },
      InternalServerError: {
        description: "Server Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              error: "Internal server error",
            },
          },
        },
      },
    },
  },
};
