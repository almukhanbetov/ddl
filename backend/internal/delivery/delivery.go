// Package delivery holds the rules that turn a delivery method and zone into
// a delivery cost. The client only ever picks the zone; it never sends a price.
package delivery

import (
	"errors"
	"math"
)

const (
	MethodDelivery = "delivery"
	MethodPickup   = "pickup"

	ZoneAlmaty       = "almaty"        // the city of Almaty itself
	ZoneAlmatyRegion = "almaty_region" // Almaty oblast, outside the city
	ZoneOtherRegion  = "other_region"  // the rest of Kazakhstan

	// OutsideAlmatyCost is the flat price of delivery to either zone outside
	// the city. frontend/lib/delivery.ts shows the same tariff in the cart.
	OutsideAlmatyCost = 30_000
)

var (
	ErrInvalidMethod = errors.New("некорректный способ получения")
	ErrInvalidZone   = errors.New("выберите зону доставки")
	ErrInvalidCost   = errors.New("стоимость доставки должна быть целым числом от 1 до 5 000 000 ₸")
)

// Quote is the outcome of applying the rules. Its Cost is never nil now; a nil
// delivery cost only exists on orders placed before the flat tariff, when a
// manager had to agree the price. That is different from zero, which is free.
type Quote struct {
	Zone *string
	Cost *float64
}

func Resolve(method, zone string) (Quote, error) {
	free := 0.0
	outside := float64(OutsideAlmatyCost)
	switch method {
	case MethodPickup:
		return Quote{Cost: &free}, nil
	case MethodDelivery:
		switch zone {
		case ZoneAlmaty:
			return Quote{Zone: &zone, Cost: &free}, nil
		case ZoneAlmatyRegion, ZoneOtherRegion:
			return Quote{Zone: &zone, Cost: &outside}, nil
		}
		return Quote{}, ErrInvalidZone
	}
	return Quote{}, ErrInvalidMethod
}

// Total adds the delivery cost to itemsTotal (nothing while it is unknown).
func (q Quote) Total(itemsTotal float64) float64 {
	if q.Cost == nil {
		return itemsTotal
	}
	return itemsTotal + *q.Cost
}

const maxAgreedCost = 5_000_000

// ValidateAgreedCost checks a cost a manager enters for an order placed before
// the flat tariff. Zero is rejected: delivery outside Almaty is paid, and an
// empty field must not mean "free".
func ValidateAgreedCost(cost float64) error {
	if cost < 1 || cost > maxAgreedCost || cost != math.Trunc(cost) {
		return ErrInvalidCost
	}
	return nil
}
