package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"ddl/backend/internal/handlers"
)

func New(h *handlers.Handler, corsOrigins []string, uploadDir string) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     corsOrigins,
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Static("/uploads", uploadDir)

	r.GET("/api/health", h.Health)

	api := r.Group("/api")
	{
		api.GET("/categories", h.ListCategories)
		api.GET("/categories/:id/subcategories", h.ListSubcategories)

		api.GET("/products", h.ListProducts)
		api.GET("/products/:id", h.GetProduct)

		api.POST("/phone/send", h.SendPhoneCode)
		api.POST("/phone/verify", h.VerifyPhoneCode)

		api.POST("/cart/quote", h.QuoteCart)

		api.POST("/orders", h.CreateOrder)
		api.GET("/orders/:publicId", h.GetOrder)

		api.GET("/site-content", h.GetSiteContent)

		api.GET("/reviews", h.ListReviews)
		api.POST("/reviews", h.CreateReview)

		api.POST("/auth/register", h.CustomerRegister)
		api.POST("/auth/login", h.CustomerLogin)
		api.POST("/auth/logout", h.CustomerLogout)
		api.GET("/auth/me", h.RequireCustomer, h.CustomerMe)

		admin := api.Group("/admin")
		{
			admin.POST("/auth/login", h.AdminLogin)
			admin.POST("/auth/logout", h.AdminLogout)

			protected := admin.Group("")
			protected.Use(h.RequireAdmin)
			{
				protected.GET("/auth/me", h.AdminMe)

				protected.GET("/products", h.AdminListProducts)
				protected.POST("/products", h.AdminCreateProduct)
				protected.PUT("/products/:id", h.AdminUpdateProduct)
				protected.DELETE("/products/:id", h.AdminDeleteProduct)

				protected.POST("/categories", h.AdminCreateCategory)
				protected.PUT("/categories/:categoryId", h.AdminUpdateCategory)
				protected.DELETE("/categories/:categoryId", h.AdminDeleteCategory)
				protected.POST("/categories/:categoryId/subcategories", h.AdminCreateSubcategory)
				protected.PUT("/categories/:categoryId/subcategories/:subcategoryId", h.AdminUpdateSubcategory)
				protected.DELETE("/categories/:categoryId/subcategories/:subcategoryId", h.AdminDeleteSubcategory)

				protected.GET("/orders", h.AdminListOrders)
				protected.PATCH("/orders/:publicId/status", h.AdminUpdateOrderStatus)

				protected.GET("/users", h.ListAdminUsers)
				protected.POST("/users", h.CreateAdminUser)

				protected.GET("/site-content", h.AdminGetSiteContent)
				protected.PUT("/site-content", h.AdminUpdateSiteContent)

				protected.POST("/uploads", h.AdminUploadImage)
			}
		}
	}

	return r
}
