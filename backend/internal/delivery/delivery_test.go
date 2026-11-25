package delivery

import (
	"errors"
	"testing"
)

func TestResolve(t *testing.T) {
	cases := []struct {
		name, method, zone string
		wantZone           string
		pending            bool
		wantErr            error
	}{
		{"almaty city", "delivery", "almaty", "almaty", false, nil},
		{"almaty region", "delivery", "almaty_region", "almaty_region", true, nil},
		{"other region", "delivery", "other_region", "other_region", true, nil},
		{"pickup", "pickup", "", "", false, nil},
		{"pickup ignores zone", "pickup", "other_region", "", false, nil},
		{"zone missing", "delivery", "", "", false, ErrInvalidZone},
		{"free text is not a zone", "delivery", "Алматы", "", false, ErrInvalidZone},
		{"region name is not a zone", "delivery", "Алматинская область", "", false, ErrInvalidZone},
		{"unknown method", "courier", "almaty", "", false, ErrInvalidMethod},
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
			if (q.Cost == nil) != tc.pending {
				t.Errorf("pending = %v, want %v", q.Cost == nil, tc.pending)
			}
			if q.Cost != nil && *q.Cost != 0 {
				t.Errorf("cost = %v, want 0", *q.Cost)
			}
			if got := q.Total(1000); got != 1000 {
				t.Errorf("total = %v, want 1000", got)
			}
		})
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
