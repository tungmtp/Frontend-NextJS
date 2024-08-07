export const mnu = {
  home: [
    { title: "Công việc của bạn", link: "/home/tasklist" },
    { title: "Thông tin về công ty", link: "/home/info" },
  ],
  products: [
    { title: "(#) Sản phẩm Explorer (X)", link: "/products/category" },
    { title: "(#) Thêm sản phẩm (X)", link: "/products/addProduct" },
    { title: "(#) Danh mục đơn vị tính (X)", link: "/products/measurement" },
    { title: "(#) Thuộc tính sản phẩm (X)", link: "/products/attribute" },
    { title: "(#) Danh mục Class (X)", link: "/products/classes" },
    { title: "(#) Giá hạch toán (X)", link: "/products/classPrice" },
    { title: "(#) Tồn vật tư đầu kỳ", link: "/products/beginningInventory" },
    {
      title: "(#) Kiểm soát tồn kho tối thiểu",
      link: "/products/controlMinimumInventory",
    },
  ],
  produce: [
    { title: "(#) Các công đoạn sản xuất (X)", link: "/produce/segment" },
    {
      title: "(#) Tạo mã và định mưc cho BTP (X)",
      link: "/produce/BTPdifinition",
    },
    {
      title: "(#) Xử lý yêu cầu cung ứng ",
      link: "/produce/supplyRequests",
    },
    {
      title: "Lên lịch sản xuất đơn lẻ",
      link: "/produce/scheduleSingleProduction",
    },
    {
      title: "Lên lịch sản xuất tổng thể",
      link: "/produce/scheduleOverallProduction",
    },
    {
      title: "Lên lịch sản xuất tự do",
      link: "/produce/scheduleProduction",
    },
    {
      title: "Điều chỉnh lịch sản xuất",
      link: "/produce/adjustProductionSchedule",
    },
    {
      title: "Lịch chạy các máy trong ngày",
      link: "/produce/daySchedule",
    },
    {
      title: "Lịch chạy một máy",
      link: "/produce/oneMachineSchedule",
    },
    {
      title: "Kiểm soát sản xuất",
      link: "/produce/productionControl",
    },
    {
      title: "(#) Nhập kết quả sản xuất ",
      link: "/produce/enterProductionResult",
    },
    {
      title: "Chốt vật tư cuối ngày",
      link: "/produce/productConfirmation",
    },
    {
      title: "Kiểm tra chốt VT cuối ngày",
      link: "/produce/checkProductConfirmation",
    },
    {
      title: "Bù trừ nhập xuất theo quy định",
      link: "/produce/offsetImportAndExport",
    },
  ],

  storage: [
    {
      title: "(#) Danh mục nhập kho hàng hóa (X)",
      link: "/storage/importProduct",
    },
    { title: "(#) Danh mục tạm nhập", link: "/storage/temporaryImport" },
    {
      title: "(#) Danh mục xuất kho hàng hóa (X)",
      link: "/storage/exportProduct",
    },
    {
      title: "(#) Tồn 01 sản phẩm ở 01 kho (X)",
      link: "/storage/oneProductOneStorage",
    },
    {
      title: "(#) Tồn 01 sản phẩm ở các kho (X)",
      link: "/storage/oneProductManyStorage",
    },
    {
      title: "(#) Tồn các sản phẩm ở 01 kho (X)",
      link: "/storage/manyProductOneStorage",
    },
    {
      title: "(#) Tồn sản phẩm theo mã màu",
      link: "/storage/accessDenied",
    },
    {
      title: "(#) Tồn sản phẩm theo thuộc tính (X)",
      link: "/storage/stockByAttribute",
    },
    {
      title: "(#) Tồn sản phẩm theo Class (X)",
      link: "/storage/stockByClass",
    },
    {
      title: "(#) Xuất chuyển sang kho khác (X)",
      link: "/storage/exportAnotherStorage",
    },
    {
      title: "(#) Nhập từ kho khác chuyển đến (X)",
      link: "/storage/importAnotherStorage",
    },
    {
      title: "(#) Thu hồi hàng thừa",
      link: "/storage/recoveryProduct",
    },
    {
      title: "(#) Cập nhật kiểm kê thừa thiếu",
      link: "/storage/updateSurplusInventory",
    },
  ],
  business: [
    { title: "(#) Danh sách đối tác (X)", link: "/business/partner" },
    { title: "(#) Danh sách liên hệ (X)", link: "/business/contact" },
    { title: "(#) Bán hàng (X)", link: "/business/order" },
    { title: "(#) Lịch giao hàng (X)", link: "/business/orderDelivery" },
    { title: "Công nợ theo nhân viên", link: "/business/debtByEmployee" },
    { title: "Công nợ một đại lý (toàn bộ)", link: "/business/debtAgentAll" },
    { title: "Công nợ một đại lý (NX-TT)", link: "/business/debtAgentNXTT" },
    { title: "Sản lượng theo nhân viên", link: "/business/outputPerEmployee" },
    { title: "Sản lượng theo dòng hàng", link: "/business/outputPerProduct" },
    { title: "Sản lượng theo đại lý", link: "/business/outputPerAgent" },
    {
      title: "Sản lượng theo đại lý và class",
      link: "/business/outputPerAgentAndClass",
    },
    {
      title: "Theo dõi sản xuất đơn hàng",
      link: "/business/inspectOderProduction",
    },
    {
      title: "Theo dõi bán hàng",
      link: "/business/inspectOder",
    },
  ],
  purchase: [
    { title: "(#) Danh mục đơn hàng mua", link: "/purchase/purchaseOrder" },
    {
      title: "Xử lý yêu cầu mua vật tư",
      link: "/purchase/purchaseMaterialRequest",
    },
    {
      title: "Xử lý yêu cầu mua hàng hóa",
      link: "/purchase/purchaseProductRequest",
    },
    {
      title: "Nhận hàng theo thông báo",
      link: "/purchase/receivePurchaseOrder",
    },
    {
      title: "Công nợ nhà cung cấp",
      link: "/purchase/supplierDebt",
    },
    {
      title: "Theo dõi mua hàng",
      link: "/purchase/inspectPurchaseOder",
    },
  ],
  accountancy: [
    { title: "Hệ thống tài khoản sử dụng", link: "/accountancy/userAccount" },
    { title: "Lập phiếu thu TM", link: "/accountancy/receipt" },
    { title: "Lập phiếu chi TM", link: "/accountancy/payment" },
    { title: "Danh mục tài khoản ngân hàng", link: "/accountancy/bankAccount" },
    { title: "Tiền về tài khoản", link: "/accountancy/accountIncome" },
    { title: "Thanh toán chuyển khoản", link: "/accountancy/transferPayment" },
    {
      title: "Kiểm tra triết khấu và giảm trừ",
      link: "/accountancy/checkDiscount",
    },
    {
      title: "Kiểm tra chi phí tính thêm cho khách",
      link: "/accountancy/additionalCost",
    },
    {
      title: "Nhập chứng từ tổng hợp",
      link: "/accountancy/enterGeneralDocument",
    },
    {
      title: "Vay ngân hàng",
      link: "/accountancy/bankLoan",
    },
  ],
  humanResources: [
    {
      title: "Phân quyền người dùng",
      link: "/humanResources/userAuthorization",
    },
    {
      title: "Sản lượng vận chuyển",
      link: "/humanResources/shippingOutput",
    },
    {
      title: "Phương tiện vận chuyển",
      link: "/humanResources/transportation",
    },
    {
      title: "Danh sách người dùng phần mềm",
      link: "/humanResources/employees",
    },
    {
      title: "Thêm người dùng phần mềm",
      link: "/humanResources/addEmployee",
    },
    {
      title: "Danh sách công nhân",
      link: "/humanResources/workers",
    },
    {
      title: "Đơn giá nhân công đứng máy",
      link: "/humanResources/workerCost",
    },
    {
      title: "Lương sản lượng từng công nhân",
      link: "/humanResources/salaryPerWorker",
    },
    {
      title: "Lương sản lượng từng tổ",
      link: "/humanResources/salaryPerGroup",
    },
    {
      title: "Lương sản lượng các tổ",
      link: "/humanResources/salaryAllGroup",
    },
    {
      title: "Lương sản lượng một công đoạn",
      link: "/humanResources/salaryPerStage",
    },
    {
      title: "Lương sản lượng các công đoạn",
      link: "/humanResources/salaryAllStage",
    },
  ],
};
