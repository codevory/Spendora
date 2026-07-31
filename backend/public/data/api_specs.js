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
                    required: ["amount", "categoryId"],
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
                    required: ["amount"],
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
    "/api/v1/transactions/recent": {
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
    "/api/v1/categories": {
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
    "/api/v1/categories/{sort}/{limit}": {
      get: {
        summary: "Get user categories with transaction counts",
        operationId: "getCategories",
        tags: ["Categories"],
        parameters: [
          {
            name: "sort",
            in: "path",
            required: true,
            description: "Sort order for categories by transaction count",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
          {
            name: "limit",
            in: "path",
            required: true,
            description: "Maximum number of categories to fetch",
            schema: {
              type: "integer",
              default: 50,
            },
          },
        ],
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
          500: {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
    "/api/v1/categories/{id}": {
      put: {
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
