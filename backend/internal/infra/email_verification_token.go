package infra

import (
	"context"
	"time"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type EmailVerificationTokenInfra struct {
}

func NewEmailVerificationTokenInfra() *EmailVerificationTokenInfra {
	return &EmailVerificationTokenInfra{}
}

func (i *EmailVerificationTokenInfra) Create(ctx context.Context, token *model.EmailVerificationToken) error {
	if err := query.EmailVerificationToken.WithContext(ctx).Create(token); err != nil {
		return err
	}
	return nil
}

func (i *EmailVerificationTokenInfra) GetByToken(ctx context.Context, tokenHash string) (*model.EmailVerificationToken, error) {
	t := query.EmailVerificationToken
	db := query.EmailVerificationToken.WithContext(ctx)
	return db.Where(t.TokenHash.Eq(tokenHash)).First()
}

func (i *EmailVerificationTokenInfra) MarkAsUsed(ctx context.Context, token *model.EmailVerificationToken) error {
	now := time.Now()
	token.UsedAt = &now
	if err := query.EmailVerificationToken.WithContext(ctx).Save(token); err != nil {
		return err
	}
	return nil
}
