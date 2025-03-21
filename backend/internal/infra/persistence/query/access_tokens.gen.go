// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"

	"gorm.io/gen"
	"gorm.io/gen/field"

	"gorm.io/plugin/dbresolver"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
)

func newAccessToken(db *gorm.DB, opts ...gen.DOOption) accessToken {
	_accessToken := accessToken{}

	_accessToken.accessTokenDo.UseDB(db, opts...)
	_accessToken.accessTokenDo.UseModel(&model.AccessToken{})

	tableName := _accessToken.accessTokenDo.TableName()
	_accessToken.ALL = field.NewAsterisk(tableName)
	_accessToken.ID = field.NewString(tableName, "id")
	_accessToken.UserID = field.NewString(tableName, "user_id")
	_accessToken.TokenHash = field.NewString(tableName, "token_hash")
	_accessToken.IssuedAt = field.NewTime(tableName, "issued_at")
	_accessToken.ExpiresAt = field.NewTime(tableName, "expires_at")
	_accessToken.RevokedAt = field.NewTime(tableName, "revoked_at")
	_accessToken.ClientInfo = field.NewString(tableName, "client_info")
	_accessToken.CreatedAt = field.NewTime(tableName, "created_at")
	_accessToken.UpdatedAt = field.NewTime(tableName, "updated_at")

	_accessToken.fillFieldMap()

	return _accessToken
}

type accessToken struct {
	accessTokenDo

	ALL        field.Asterisk
	ID         field.String
	UserID     field.String
	TokenHash  field.String
	IssuedAt   field.Time
	ExpiresAt  field.Time
	RevokedAt  field.Time
	ClientInfo field.String
	CreatedAt  field.Time
	UpdatedAt  field.Time

	fieldMap map[string]field.Expr
}

func (a accessToken) Table(newTableName string) *accessToken {
	a.accessTokenDo.UseTable(newTableName)
	return a.updateTableName(newTableName)
}

func (a accessToken) As(alias string) *accessToken {
	a.accessTokenDo.DO = *(a.accessTokenDo.As(alias).(*gen.DO))
	return a.updateTableName(alias)
}

func (a *accessToken) updateTableName(table string) *accessToken {
	a.ALL = field.NewAsterisk(table)
	a.ID = field.NewString(table, "id")
	a.UserID = field.NewString(table, "user_id")
	a.TokenHash = field.NewString(table, "token_hash")
	a.IssuedAt = field.NewTime(table, "issued_at")
	a.ExpiresAt = field.NewTime(table, "expires_at")
	a.RevokedAt = field.NewTime(table, "revoked_at")
	a.ClientInfo = field.NewString(table, "client_info")
	a.CreatedAt = field.NewTime(table, "created_at")
	a.UpdatedAt = field.NewTime(table, "updated_at")

	a.fillFieldMap()

	return a
}

func (a *accessToken) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := a.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (a *accessToken) fillFieldMap() {
	a.fieldMap = make(map[string]field.Expr, 9)
	a.fieldMap["id"] = a.ID
	a.fieldMap["user_id"] = a.UserID
	a.fieldMap["token_hash"] = a.TokenHash
	a.fieldMap["issued_at"] = a.IssuedAt
	a.fieldMap["expires_at"] = a.ExpiresAt
	a.fieldMap["revoked_at"] = a.RevokedAt
	a.fieldMap["client_info"] = a.ClientInfo
	a.fieldMap["created_at"] = a.CreatedAt
	a.fieldMap["updated_at"] = a.UpdatedAt
}

func (a accessToken) clone(db *gorm.DB) accessToken {
	a.accessTokenDo.ReplaceConnPool(db.Statement.ConnPool)
	return a
}

func (a accessToken) replaceDB(db *gorm.DB) accessToken {
	a.accessTokenDo.ReplaceDB(db)
	return a
}

type accessTokenDo struct{ gen.DO }

type IAccessTokenDo interface {
	gen.SubQuery
	Debug() IAccessTokenDo
	WithContext(ctx context.Context) IAccessTokenDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() IAccessTokenDo
	WriteDB() IAccessTokenDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) IAccessTokenDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) IAccessTokenDo
	Not(conds ...gen.Condition) IAccessTokenDo
	Or(conds ...gen.Condition) IAccessTokenDo
	Select(conds ...field.Expr) IAccessTokenDo
	Where(conds ...gen.Condition) IAccessTokenDo
	Order(conds ...field.Expr) IAccessTokenDo
	Distinct(cols ...field.Expr) IAccessTokenDo
	Omit(cols ...field.Expr) IAccessTokenDo
	Join(table schema.Tabler, on ...field.Expr) IAccessTokenDo
	LeftJoin(table schema.Tabler, on ...field.Expr) IAccessTokenDo
	RightJoin(table schema.Tabler, on ...field.Expr) IAccessTokenDo
	Group(cols ...field.Expr) IAccessTokenDo
	Having(conds ...gen.Condition) IAccessTokenDo
	Limit(limit int) IAccessTokenDo
	Offset(offset int) IAccessTokenDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) IAccessTokenDo
	Unscoped() IAccessTokenDo
	Create(values ...*model.AccessToken) error
	CreateInBatches(values []*model.AccessToken, batchSize int) error
	Save(values ...*model.AccessToken) error
	First() (*model.AccessToken, error)
	Take() (*model.AccessToken, error)
	Last() (*model.AccessToken, error)
	Find() ([]*model.AccessToken, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*model.AccessToken, err error)
	FindInBatches(result *[]*model.AccessToken, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*model.AccessToken) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) IAccessTokenDo
	Assign(attrs ...field.AssignExpr) IAccessTokenDo
	Joins(fields ...field.RelationField) IAccessTokenDo
	Preload(fields ...field.RelationField) IAccessTokenDo
	FirstOrInit() (*model.AccessToken, error)
	FirstOrCreate() (*model.AccessToken, error)
	FindByPage(offset int, limit int) (result []*model.AccessToken, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) IAccessTokenDo
	UnderlyingDB() *gorm.DB
	schema.Tabler

	FilterWithNameAndRole(name string, role string) (result []model.AccessToken, err error)
}

// SELECT * FROM @@table WHERE name = @name{{if role !=""}} AND role = @role{{end}}
func (a accessTokenDo) FilterWithNameAndRole(name string, role string) (result []model.AccessToken, err error) {
	var params []interface{}

	var generateSQL strings.Builder
	params = append(params, name)
	generateSQL.WriteString("SELECT * FROM access_tokens WHERE name = ? ")
	if role != "" {
		params = append(params, role)
		generateSQL.WriteString("AND role = ? ")
	}

	var executeSQL *gorm.DB
	executeSQL = a.UnderlyingDB().Raw(generateSQL.String(), params...).Find(&result) // ignore_security_alert
	err = executeSQL.Error

	return
}

func (a accessTokenDo) Debug() IAccessTokenDo {
	return a.withDO(a.DO.Debug())
}

func (a accessTokenDo) WithContext(ctx context.Context) IAccessTokenDo {
	return a.withDO(a.DO.WithContext(ctx))
}

func (a accessTokenDo) ReadDB() IAccessTokenDo {
	return a.Clauses(dbresolver.Read)
}

func (a accessTokenDo) WriteDB() IAccessTokenDo {
	return a.Clauses(dbresolver.Write)
}

func (a accessTokenDo) Session(config *gorm.Session) IAccessTokenDo {
	return a.withDO(a.DO.Session(config))
}

func (a accessTokenDo) Clauses(conds ...clause.Expression) IAccessTokenDo {
	return a.withDO(a.DO.Clauses(conds...))
}

func (a accessTokenDo) Returning(value interface{}, columns ...string) IAccessTokenDo {
	return a.withDO(a.DO.Returning(value, columns...))
}

func (a accessTokenDo) Not(conds ...gen.Condition) IAccessTokenDo {
	return a.withDO(a.DO.Not(conds...))
}

func (a accessTokenDo) Or(conds ...gen.Condition) IAccessTokenDo {
	return a.withDO(a.DO.Or(conds...))
}

func (a accessTokenDo) Select(conds ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.Select(conds...))
}

func (a accessTokenDo) Where(conds ...gen.Condition) IAccessTokenDo {
	return a.withDO(a.DO.Where(conds...))
}

func (a accessTokenDo) Order(conds ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.Order(conds...))
}

func (a accessTokenDo) Distinct(cols ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.Distinct(cols...))
}

func (a accessTokenDo) Omit(cols ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.Omit(cols...))
}

func (a accessTokenDo) Join(table schema.Tabler, on ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.Join(table, on...))
}

func (a accessTokenDo) LeftJoin(table schema.Tabler, on ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.LeftJoin(table, on...))
}

func (a accessTokenDo) RightJoin(table schema.Tabler, on ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.RightJoin(table, on...))
}

func (a accessTokenDo) Group(cols ...field.Expr) IAccessTokenDo {
	return a.withDO(a.DO.Group(cols...))
}

func (a accessTokenDo) Having(conds ...gen.Condition) IAccessTokenDo {
	return a.withDO(a.DO.Having(conds...))
}

func (a accessTokenDo) Limit(limit int) IAccessTokenDo {
	return a.withDO(a.DO.Limit(limit))
}

func (a accessTokenDo) Offset(offset int) IAccessTokenDo {
	return a.withDO(a.DO.Offset(offset))
}

func (a accessTokenDo) Scopes(funcs ...func(gen.Dao) gen.Dao) IAccessTokenDo {
	return a.withDO(a.DO.Scopes(funcs...))
}

func (a accessTokenDo) Unscoped() IAccessTokenDo {
	return a.withDO(a.DO.Unscoped())
}

func (a accessTokenDo) Create(values ...*model.AccessToken) error {
	if len(values) == 0 {
		return nil
	}
	return a.DO.Create(values)
}

func (a accessTokenDo) CreateInBatches(values []*model.AccessToken, batchSize int) error {
	return a.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (a accessTokenDo) Save(values ...*model.AccessToken) error {
	if len(values) == 0 {
		return nil
	}
	return a.DO.Save(values)
}

func (a accessTokenDo) First() (*model.AccessToken, error) {
	if result, err := a.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*model.AccessToken), nil
	}
}

func (a accessTokenDo) Take() (*model.AccessToken, error) {
	if result, err := a.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*model.AccessToken), nil
	}
}

func (a accessTokenDo) Last() (*model.AccessToken, error) {
	if result, err := a.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*model.AccessToken), nil
	}
}

func (a accessTokenDo) Find() ([]*model.AccessToken, error) {
	result, err := a.DO.Find()
	return result.([]*model.AccessToken), err
}

func (a accessTokenDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*model.AccessToken, err error) {
	buf := make([]*model.AccessToken, 0, batchSize)
	err = a.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (a accessTokenDo) FindInBatches(result *[]*model.AccessToken, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return a.DO.FindInBatches(result, batchSize, fc)
}

func (a accessTokenDo) Attrs(attrs ...field.AssignExpr) IAccessTokenDo {
	return a.withDO(a.DO.Attrs(attrs...))
}

func (a accessTokenDo) Assign(attrs ...field.AssignExpr) IAccessTokenDo {
	return a.withDO(a.DO.Assign(attrs...))
}

func (a accessTokenDo) Joins(fields ...field.RelationField) IAccessTokenDo {
	for _, _f := range fields {
		a = *a.withDO(a.DO.Joins(_f))
	}
	return &a
}

func (a accessTokenDo) Preload(fields ...field.RelationField) IAccessTokenDo {
	for _, _f := range fields {
		a = *a.withDO(a.DO.Preload(_f))
	}
	return &a
}

func (a accessTokenDo) FirstOrInit() (*model.AccessToken, error) {
	if result, err := a.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*model.AccessToken), nil
	}
}

func (a accessTokenDo) FirstOrCreate() (*model.AccessToken, error) {
	if result, err := a.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*model.AccessToken), nil
	}
}

func (a accessTokenDo) FindByPage(offset int, limit int) (result []*model.AccessToken, count int64, err error) {
	result, err = a.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = a.Offset(-1).Limit(-1).Count()
	return
}

func (a accessTokenDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = a.Count()
	if err != nil {
		return
	}

	err = a.Offset(offset).Limit(limit).Scan(result)
	return
}

func (a accessTokenDo) Scan(result interface{}) (err error) {
	return a.DO.Scan(result)
}

func (a accessTokenDo) Delete(models ...*model.AccessToken) (result gen.ResultInfo, err error) {
	return a.DO.Delete(models)
}

func (a *accessTokenDo) withDO(do gen.Dao) *accessTokenDo {
	a.DO = *do.(*gen.DO)
	return a
}
