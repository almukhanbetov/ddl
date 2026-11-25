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
)

var (
	ErrInvalidMethod = errors.New("некорректный способ получения")
	ErrInvalidZone   = errors.New("выберите зону доставки")
	ErrInvalidCost   = errors.New("стоимость доставки должна быть целым числом от 1 до 5 000 000 ₸")
)

// Quote is the outcome of applying the rules. A nil Cost means the price can't
// be determined automatically and a manager has to confirm it; that is
// different from a Cost of zero, which means free.
type Quote struct {
	Zone *string
	Cost *float64
}

func Resolve(method, zone string) (Quote, error) {
	free := 0.0
	switch method {
	case MethodPickup:
		return Quote{Cost: &free}, nil
	case MethodDelivery:
		switch zone {
		case ZoneAlmaty:
			return Quote{Zone: &zone, Cost: &free}, nil
		case ZoneAlmatyRegion, ZoneOtherRegion:
			// Published tariffs are "from X" by distance, so no exact sum yet.
			return Quote{Zone: &zone}, nil
		}
		return Quote{}, ErrInvalidZone
	}
	return Quote{}, ErrInvalidMethod
}

// Total adds the delivery cost to itemsTotal when it is known.
func (q Quote) Total(itemsTotal float64) float64 {
	if q.Cost == nil {
		return itemsTotal
	}
	return itemsTotal + *q.Cost
}

const maxAgreedCost = 5_000_000

// ValidateAgreedCost checks a cost entered by a manager. Zero is rejected:
// delivery outside Almaty is paid, and an empty field must not mean "free".
func ValidateAgreedCost(cost float64) error {
	if cost < 1 || cost > maxAgreedCost || cost != math.Trunc(cost) {
		return ErrInvalidCost
	}
	return nil
}
