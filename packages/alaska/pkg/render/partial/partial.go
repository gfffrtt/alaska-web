package partial

import (
	"context"
	"fmt"

	"net/http"

	"github.com/gfffrtt/alaska/packages/alaska/pkg/render"
)

type Partial struct {
	ID        string
	Component render.Component
}

func NewPartial(id string, component render.Component) *Partial {
	return &Partial{
		ID:        id,
		Component: component,
	}
}

func (p *Partial) Render(ctx context.Context, w http.ResponseWriter) error {
	err := p.Component.Render(ctx, w)
	if err != nil {
		return err
	}
	_, err = w.Write([]byte(fmt.Sprintf(`
		<script>
			(() => {
				const content = document.querySelector('template[data-content="%s"]');
				const loading = document.querySelector('[data-loading="%s"]');
				const error = document.querySelector('[data-error="%s"]');
				if (!content) {
					loading.replaceWith(error.content);
				}
				loading.replaceWith(content.content);
			})();
		</script>
	`, p.ID, p.ID, p.ID)))
	return err
}
