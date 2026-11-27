package delivery

import (
	"errors"
	"testing"
)

func TestResolve(t *testing.T) {
	cases := []struct {
		name, method, zone string
		wantZone           string
		wantCost           float64
		wantErr            error
	}{
		{"almaty city", "delivery", "almaty", "almaty", 0, nil},
		{"almaty region", "delivery", "almaty_region", "almaty_region", 30_000, nil},
		{"other region", "delivery", "other_region", "other_region", 30_000, nil},
		{"pickup", "pickup", "", "", 0, nil},
		{"pickup ignores zone", "pickup", "other_region", "", 0, nil},
		{"zone missing", "delivery", "", "", 0, ErrInvalidZone},
		{"free text is not a zone", "delivery", "Алматы", "", 0, ErrInvalidZone},
		{"region name is not a zone", "delivery", "Алматинская область", "", 0, ErrInvalidZone},
		{"unknown method", "courier", "almaty", "", 0, ErrInvalidMethod},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			q, err := Resolve(tc.method, tc.zone)
			if !errors.Is(err, tc.wantErr) {
				t.Fatalf("err = %v, want %v", err, tc.wantErr)
			}
			if err != nil {
				return
			}
			zone := ""
			if q.Zone != nil {
				zone = *q.Zone
			}
			if zone != tc.wantZone {
				t.Errorf("zone = %q, want %q", zone, tc.wantZone)
			}
			if q.Cost == nil {
				t.Fatalf("cost = nil, want %v", tc.wantCost)
			}
			if *q.Cost != tc.wantCost {
				t.Errorf("cost = %v, want %v", *q.Cost, tc.wantCost)
			}
			// The example from the tariff: 50 000 ₸ of rental.
			if got, want := q.Total(50_000), 50_000+tc.wantCost; got != want {
				t.Errorf("total = %v, want %v", got, want)
			}
		})
	}
}

func TestTotalWithoutCost(t *testing.T) {
	// Orders from before the flat tariff may still have no delivery cost.
	if got := (Quote{}).Total(50_000); got != 50_000 {
		t.Errorf("total = %v, want 50000", got)
	}
}

func TestValidateAgreedCost(t *testing.T) {
	for _, ok := range []float64{1, 14000, 5_000_000} {
		if err := ValidateAgreedCost(ok); err != nil {
			t.Errorf("%v: unexpected error %v", ok, err)
		}
	}
	for _, bad := range []float64{0, -1, 0.5, 100.5, 5_000_001} {
		if err := ValidateAgreedCost(bad); !errors.Is(err, ErrInvalidCost) {
			t.Errorf("%v: err = %v, want ErrInvalidCost", bad, err)
		}
	}
}
