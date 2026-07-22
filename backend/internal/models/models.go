package models

import "time"

type Category struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	ItemCount int    `json:"itemCount"`
	ImageURL  string `json:"imageUrl"`
}

type Subcategory struct {
	ID         string `json:"id"`
	CategoryID string `json:"categoryId"`
	Name       string `json:"name"`
	ItemCount  int    `json:"itemCount"`
}

type CategoryInput struct {
	Name      string `json:"name" binding:"required"`
	ImageURL  string `json:"imageUrl" binding:"required"`
	ItemCount int    `json:"itemCount" binding:"min=0"`
}

type SubcategoryInput struct {
	Name      string `json:"name" binding:"required"`
	ItemCount int    `json:"itemCount" binding:"min=0"`
}

type Product struct {
	ID              string  `json:"id"`
	CategoryID      string  `json:"categoryId"`
	SubcategoryID   string  `json:"subcategoryId"`
	CategoryName    string  `json:"categoryName"`
	SubcategoryName string  `json:"subcategoryName"`
	Name            string  `json:"name"`
	Article         string  `json:"article"`
	Stock           int     `json:"stock"`
	PriceDay        float64 `json:"priceDay"`
	DamageCost      float64 `json:"damageCost"`
	ImageURL        string  `json:"imageUrl"`
}

type ProductDetail struct {
	Product
	Description string   `json:"description"`
	Gallery     []string `json:"gallery"`
}

type ProductInput struct {
	CategoryID    string  `json:"categoryId" binding:"required"`
	SubcategoryID string  `json:"subcategoryId" binding:"required"`
	Name          string  `json:"name" binding:"required"`
	Article       string  `json:"article" binding:"required"`
	Stock         int     `json:"stock" binding:"min=0"`
	PriceDay      float64 `json:"priceDay" binding:"min=0"`
	DamageCost    float64 `json:"damageCost" binding:"min=0"`
	ImageURL      string  `json:"imageUrl" binding:"required"`
	Description   string  `json:"description"`
}

type HeroStat struct {
	Value string `json:"value"`
	Label string `json:"label"`
}

type HeroContent struct {
	Badge             string     `json:"badge"`
	TitleBefore       string     `json:"titleBefore"`
	TitleAccent       string     `json:"titleAccent"`
	TitleAfter        string     `json:"titleAfter"`
	Lead              string     `json:"lead"`
	SearchPlaceholder string     `json:"searchPlaceholder"`
	Stats             []HeroStat `json:"stats"`
}

type Step struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type HowItWorksContent struct {
	Eyebrow string `json:"eyebrow"`
	Title   string `json:"title"`
	Steps   []Step `json:"steps"`
}

type FooterContent struct {
	About string `json:"about"`
}

type ContactsContent struct {
	Phone     string `json:"phone"`
	Email     string `json:"email"`
	Address   string `json:"address"`
	WorkHours string `json:"workHours"`
}

type PriceRow struct {
	Label string `json:"label"`
	Price string `json:"price"`
}

type DeliveryPageContent struct {
	Photo          string     `json:"photo"`
	Eyebrow        string     `json:"eyebrow"`
	Heading        string     `json:"heading"`
	Intro          string     `json:"intro"`
	CourierTitle   string     `json:"courierTitle"`
	CourierDesc    string     `json:"courierDesc"`
	PickupTitle    string     `json:"pickupTitle"`
	PickupDesc     string     `json:"pickupDesc"`
	PaymentTitle   string     `json:"paymentTitle"`
	PaymentDesc    string     `json:"paymentDesc"`
	NoPrepayTitle  string     `json:"noPrepayTitle"`
	NoPrepayDesc   string     `json:"noPrepayDesc"`
	ZonesTitle     string     `json:"zonesTitle"`
	Zones          []PriceRow `json:"zones"`
	ImportantTitle string     `json:"importantTitle"`
	ImportantText  string     `json:"importantText"`
	QuestionsTitle string     `json:"questionsTitle"`
	QuestionsDesc  string     `json:"questionsDesc"`
	ContactUs      string     `json:"contactUs"`
}

type AboutPageContent struct {
	Photo             string     `json:"photo"`
	Badge             string     `json:"badge"`
	TitleBefore       string     `json:"titleBefore"`
	TitleAccent       string     `json:"titleAccent"`
	TitleAfter        string     `json:"titleAfter"`
	Lead              string     `json:"lead"`
	Stats             []HeroStat `json:"stats"`
	PrinciplesEyebrow string     `json:"principlesEyebrow"`
	PrinciplesTitle   string     `json:"principlesTitle"`
	Principles        []Step     `json:"principles"`
	ShowroomEyebrow   string     `json:"showroomEyebrow"`
	ShowroomTitle     string     `json:"showroomTitle"`
	ShowroomDesc      string     `json:"showroomDesc"`
	ShowroomCta       string     `json:"showroomCta"`
}

type ContactsPageContent struct {
	Photo        string `json:"photo"`
	Eyebrow      string `json:"eyebrow"`
	Heading      string `json:"heading"`
	Intro        string `json:"intro"`
	MapCaption   string `json:"mapCaption"`
	VisitNote    string `json:"visitNote"`
	TelegramNote string `json:"telegramNote"`
	WhatsappNote string `json:"whatsappNote"`
}

type SiteContent struct {
	Hero         HeroContent         `json:"hero"`
	HowItWorks   HowItWorksContent   `json:"howItWorks"`
	Footer       FooterContent       `json:"footer"`
	Contacts     ContactsContent     `json:"contacts"`
	DeliveryPage DeliveryPageContent `json:"deliveryPage"`
	AboutPage    AboutPageContent    `json:"aboutPage"`
	ContactsPage ContactsPageContent `json:"contactsPage"`
}

type LocalizedSiteContent struct {
	RU SiteContent `json:"ru"`
	KK SiteContent `json:"kk"`
}

type Review struct {
	ID         int64     `json:"id"`
	AuthorName string    `json:"authorName"`
	Text       string    `json:"text"`
	Photos     []string  `json:"photos"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Customer struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}

type CustomerRegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type CustomerLoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AdminUser struct {
	ID           int64     `json:"id"`
	Email        string    `json:"email"`
	Name         string    `json:"name"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}

type PhoneVerification struct {
	ID        int64
	Phone     string
	Code      string
	Channel   string
	Token     *string
	Verified  bool
	CreatedAt time.Time
	ExpiresAt time.Time
}

type OrderItemInput struct {
	ProductID string `json:"productId" binding:"required"`
	Qty       int    `json:"qty" binding:"required,min=1"`
}

type OrderItem struct {
	ProductID   string  `json:"productId"`
	ProductName string  `json:"productName"`
	Qty         int     `json:"qty"`
	PriceDay    float64 `json:"priceDay"`
	LineTotal   float64 `json:"lineTotal"`
}

type Order struct {
	ID             int64       `json:"id"`
	PublicID       string      `json:"publicId"`
	RentalStart    string      `json:"rentalStart"`
	RentalEnd      string      `json:"rentalEnd"`
	RentalDays     int         `json:"rentalDays"`
	DeliveryMethod string      `json:"deliveryMethod"`
	Address        *string     `json:"address,omitempty"`
	ContactName    string      `json:"contactName"`
	ContactPhone   string      `json:"contactPhone"`
	PhoneVerified  bool        `json:"phoneVerified"`
	Comment        string      `json:"comment"`
	ItemsTotal     float64     `json:"itemsTotal"`
	DeliveryCost   float64     `json:"deliveryCost"`
	Total          float64     `json:"total"`
	Status         string      `json:"status"`
	CreatedAt      time.Time   `json:"createdAt"`
	Items          []OrderItem `json:"items"`
}
