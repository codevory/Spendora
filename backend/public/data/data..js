import { is_Production } from "../../db/getBDConnection.js";

export const apiSpecs = {
  openapi: "3.0.3",
  info: {
    title: "Finance Tracking API",
    description:
      "API documentation for user authentication, transactions (expenses & incomes), and category management.",
    version: "1.0.0",
  },
  servers: [
    {
      url: `${is_Production ? "https://spendora-backend-4ado.onrender.com" : "http://localhost:2122"}`,
      description: `${is_Production ? "Production Server" : "local server"}`,
    },
  ],
  paths: {
    "/api/v1/auth/me": {
      get: {
        summary: "Get current user profile",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "User profile details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserProfile",
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "User Login",
        tags: ["Authentication"],
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
                    example: "rabia@gmail.com",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserProfile",
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/GenericError",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        summary: "User Registration",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "fullName",
                  "email",
                  "username",
                  "password",
                  "currency",
                ],
                properties: {
                  fullName: {
                    type: "string",
                    example: "Rabia",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "rabia@gmail.com",
                  },
                  username: {
                    type: "string",
                    example: "rabia12",
                  },
                  password: {
                    type: "string",
                    example: "securePassword123",
                  },
                  currency: {
                    type: "string",
                    example: "inr",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User registered successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/GenericError",
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      get: {
        summary: "User Logout",
        tags: ["Authentication"],
        responses: {
          200: {
            description:
              "Successfully logged out, session destroyed, cookie cleared",
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
        },
      },
    },
    "/api/v1/auth/sid": {
      get: {
        summary: "Get Session ID",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "Session ID returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sid: {
                      type: "string",
                      example: "s%3A7a...session_id_hash",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
        },
      },
    },
    "/api/v1/auth/csrf": {
      get: {
        summary: "Get CSRF Token",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "CSRF Token returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    csrf: {
                      type: "string",
                      example: "token_string_here",
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
        },
      },
    },
    "/api/v1/transaction/recents": {
      get: {
        summary: "Get Recent Transactions (Incomes & Expenses)",
        tags: ["Transactions"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "size",
            in: "query",
            schema: {
              type: "integer",
              default: 250,
            },
          },
          {
            name: "skip",
            in: "query",
            schema: {
              type: "integer",
              default: 0,
            },
          },
          {
            name: "from",
            in: "query",
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "to",
            in: "query",
            schema: {
              type: "string",
              format: "date-time",
            },
          },
        ],
        responses: {
          200: {
            description: "List of recent transactions",
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
        },
      },
    },
    "/api/v1/transaction/expenses": {
      get: {
        summary: "Get All Expenses",
        tags: ["Expenses"],
        parameters: [
          {
            name: "query",
            in: "query",
            schema: {
              type: "string",
            },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "size",
            in: "query",
            schema: {
              type: "integer",
              default: 250,
            },
          },
          {
            name: "skip",
            in: "query",
            schema: {
              type: "integer",
              default: 0,
            },
          },
          {
            name: "from",
            in: "query",
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "to",
            in: "query",
            schema: {
              type: "string",
              format: "date-time",
            },
          },
        ],
        responses: {
          200: {
            description: "List of expenses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      $ref: "#/components/schemas/ExpensePaginationMeta",
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
        },
      },
    },
    "/api/v1/transaction/expenses/add": {
      post: {
        summary: "Add New Expense",
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
                    required: [
                      "amount",
                      "entity",
                      "date",
                      "categoryId",
                      "transactionId",
                    ],
                    properties: {
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
                      categoryId: {
                        type: "integer",
                        example: 10,
                      },
                      transactionId: {
                        type: "string",
                        example: "TXN_b2daf9b3-5e6f-4423-8e31-dc0a38a9deb6",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Expense created successfully",
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
        },
      },
    },
    "/api/v1/transaction/incomes": {
      get: {
        summary: "Get All Incomes",
        tags: ["Incomes"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "size",
            in: "query",
            schema: {
              type: "integer",
              default: 250,
            },
          },
          {
            name: "skip",
            in: "query",
            schema: {
              type: "integer",
              default: 0,
            },
          },
          {
            name: "from",
            in: "query",
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "to",
            in: "query",
            schema: {
              type: "string",
              format: "date-time",
            },
          },
        ],
        responses: {
          200: {
            description: "List of income entries",
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
        },
      },
    },
    "/api/v1/transaction/incomes/add": {
      post: {
        summary: "Add New Income",
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
                    required: ["amount", "entity", "date", "transactionId"],
                    properties: {
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
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
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
        },
      },
    },
    "/api/v1/categories": {
      get: {
        summary: "Get All Categories",
        tags: ["Categories"],
        responses: {
          200: {
            description: "List of categories with transaction count",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    categories: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/CategoryItem",
                      },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        size: {
                          type: "integer",
                          example: 2,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/categories/add": {
      post: {
        summary: "Add Category",
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
          200: {
            description: "Category created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    category: {
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
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/categories/rename": {
      post: {
        summary: "Rename Category",
        tags: ["Categories"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category"],
                properties: {
                  category: {
                    type: "object",
                    required: ["id", "name"],
                    properties: {
                      id: {
                        type: "integer",
                        example: 10,
                      },
                      name: {
                        type: "string",
                        example: "household bills",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Category updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    category: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 10,
                        },
                        name: {
                          type: "string",
                          example: "household bills",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/categories/delete": {
      delete: {
        summary: "Delete Category",
        tags: ["Categories"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category"],
                properties: {
                  category: {
                    type: "object",
                    required: ["id", "name"],
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
                },
              },
            },
          },
        },
        responses: {
          204: {
            description: "Category deleted successfully",
          },
          400: {
            $ref: "#/components/responses/GenericError",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      UserProfile: {
        type: "object",
        properties: {
          fullName: {
            type: "string",
            example: "Rabia",
          },
          uid: {
            type: "string",
            format: "uuid",
            example: "354885f1-053e-4801-92cc-23837ddbfa53",
          },
          email: {
            type: "string",
            format: "email",
            example: "rabia@gmail.com",
          },
          username: {
            type: "string",
            example: "rabia12",
          },
          currency: {
            type: "string",
            example: "inr",
          },
          inserted_at: {
            type: "string",
            format: "date-time",
            example: "2026-07-27T15:21:08.648Z",
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
            type: "object",
            properties: {
              requested: {
                type: "integer",
                example: 250,
              },
              received: {
                type: "integer",
                example: 1,
              },
            },
          },
        },
      },
      ExpensePaginationMeta: {
        type: "object",
        properties: {
          query: {
            type: "string",
            nullable: true,
            example: null,
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
            type: "object",
            properties: {
              requested: {
                type: "integer",
                example: 250,
              },
              received: {
                type: "integer",
                example: 1,
              },
            },
          },
        },
      },
      TransactionItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "8444ee25-a8ab-4bb0-8e78-9ba064d15dd5",
          },
          amount: {
            type: "string",
            example: "123.91",
          },
          type: {
            type: "string",
            enum: ["expense", "income"],
            example: "expense",
          },
          entity: {
            type: "string",
            example: "Water bill",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-25T18:30:00.000Z",
          },
          transactionId: {
            type: "string",
            example: "TXN_d9ff5338-bc75-4dbc-93b7-3ce4c078eab9",
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
            example: "2026-07-27T15:21:45.697Z",
          },
        },
      },
      ExpenseItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "8444ee25-a8ab-4bb0-8e78-9ba064d15dd5",
          },
          amount: {
            type: "string",
            example: "19173.00",
          },
          entity: {
            type: "string",
            example: "Water bill",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-25T18:30:00.000Z",
          },
          transactionId: {
            type: "string",
            example: "TXN_d9ff5338-bc75-4dbc-93b7-3ce4c078eab9",
          },
          categoryId: {
            type: "integer",
            example: 10,
          },
          categoryName: {
            type: "string",
            example: "domestic bills",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-07-27T15:21:45.697Z",
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
            type: "string",
            format: "uuid",
            example: "ac9b61cc-e394-4f43-9c2d-a636ce781f96",
          },
          amount: {
            type: "string",
            example: "29216.00",
          },
          entity: {
            type: "string",
            example: "Fiverr",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2026-07-24T18:30:00.000Z",
          },
          transactionId: {
            type: "string",
            example: "TXN_e44c18a5-2f35-423b-9dae-8b55e9817f30",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-07-27T15:21:19.922Z",
          },
        },
      },
      CategoryItem: {
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
          transactionCount: {
            type: "string",
            example: "2",
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Unauthorized - Missing or invalid session cookie",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Unauthorized access",
                },
              },
            },
          },
        },
      },
      GenericError: {
        description: "Error response object",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "An error occurred",
                },
              },
            },
          },
        },
      },
    },
  },
};
